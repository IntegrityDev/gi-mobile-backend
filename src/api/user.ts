import { Request, Response, NextFunction } from 'express';
import { ClientService, EmployeeService, UserProfileService, UserService } from '../services'; 
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import multer from "multer";
import cloudinary from "cloudinary";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
const fs = require('fs');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });
cloudinary.v2.config({
    cloud_name: "djtylbwdh",
    api_key: "812681364621242",
    api_secret: "Yapy7hT92p366sAYogeMPXISF78",
    secure: true,
  });

export default function setupUserRoutes(app: any): void {
    const service = new UserService();
    
    app.get('/users', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user;
            const { data } = await service.GetAllUsers(userId);
            return res.json({
                data
            });
        } catch (error) {
            next(error);
        }
    });

    app.get('/users/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetUserById(+id);
            return res.json({
                data
            });
        } catch (error) {
            next(error);
        }
    });

    app.delete('/users/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { data } = await service.Delete(+id!, +userId);
            return res.json({
                data
            });
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: "Error deleting user alert"
            });
        }
    });

    app.post('/users/:id/profile', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const userProfileService = new UserProfileService();
            const { id: createdBy } = req.user;
            const userId = req.params.id;
            const { profileId } = req.body;

            if (!userId || isNaN(+userId)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: 'User ID is invalid or missing.'
                });
            }

            if (!profileId || isNaN(+profileId)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: 'Profile ID must be equal to user ID.'
                });
            }
            
            const { data } = await userProfileService.Create(+userId, profileId, createdBy);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.delete('/users/profile/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const userProfileService = new UserProfileService();
            const { id: createdBy } = req.user;
            const userProfileId = req.params.id;

            if (!userProfileId || isNaN(+userProfileId)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: 'UserProfile ID is invalid or missing.'
                });
            }
            
            const { data } = await userProfileService.Delete(+userProfileId, createdBy);
            return res.status(STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post(
        "/user-profile-photo",
        AuthMiddleware,
        upload.array("images"),
        async (req: CustomRequest, res: Response, next: NextFunction) => {
          try {
            const {identification, isEmployee} = req.body;
            const uploadPromises: any[] = [];
            const tempFilesCreated: string[] = [];
            const options = { folder: "profiles"}
            const folderPath = __dirname + "/upload";
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath);
              console.log('Folder is created:', folderPath);
            }

            for (const image of req.files as any[]) {
              const isJPEG = image.mimetype === "image/jpeg";
              const isPNG = image.mimetype === "image/png";
    
              let uploadPromise;
              const fileName = __dirname + "/upload/" + uuidv4();
              if (isJPEG) {
                await sharp(image.path)
                  .jpeg({ quality: 60, progressive: true })
                  .withMetadata()
                  .toFile(fileName)
                  .then(() => {
                    uploadPromise = cloudinary.v2.uploader.upload(fileName, options);
                    uploadPromises.push(uploadPromise);
                    tempFilesCreated.push(fileName);
                  })
                  .catch((error: any) => {
                    console.log("error jpg", error)
                  });
              } else if (isPNG) {
                await sharp(image.path)
                  .png({ compressionLevel: 5 })
                  .withMetadata()
                  .toFile(fileName)
                  .then(() => {
                    uploadPromise = cloudinary.v2.uploader.upload(fileName, options);
                    uploadPromises.push(uploadPromise);
                    tempFilesCreated.push(fileName);
                  })
                  .catch((error: any) => {
                    console.log("error png", error)
                  });
              }
            }
            const uploadedImages = await Promise.all(uploadPromises);
            console.log("Profile photo upload to Cloudinary");
    
            const reportPhotos = [];
            const { id: userId } = req.user as { id: number };
            for (const uploadedImage of uploadedImages) {
              const dataUrl = {
                publicId: uploadedImage.public_id,
                imageUrl: uploadedImage.secure_url,
                secureUrl: uploadedImage.secure_url,
                url: uploadedImage.secure_url,
              };
    
              reportPhotos.push(dataUrl);
            }
            
            tempFilesCreated.forEach(file => {
                fs.unlinkSync(file);
              });

            if (isEmployee) {
                const employeeService = new EmployeeService();
                const {data: employee} = await employeeService.GetByIdentification(identification);
                const { data } = await employeeService.Update(
                  employee.id,
                  { imageUrl: reportPhotos[0]?.secureUrl },
                  userId
                );
                return res.status(data?.statusCode || STATUS_CODES.OK).json({
                    created: true,
                    data,
                  });
            } else {
                const clientService = new ClientService();
                const {data: client} = await clientService.GetByIdentification(identification);
                const { data } = await clientService.Update(
                  client.id,
                  { imageUrl: reportPhotos[0]?.secureUrl },
                  userId
                );
                return res.status(data?.statusCode || STATUS_CODES.OK).json({
                    created: true,
                    data,
                  });
            }
            
            
            
          } catch (error) {
            console.log(error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
              message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR,
            });
          }
        }
      );
}
