import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { AnnouncementService } from '../services';
import multer from "multer";
import cloudinary from "cloudinary";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
const fs = require("fs");

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

export default function setupAnnouncementRoutes(app: any): void {
    const service = new AnnouncementService();
    
    app.get('/announcements', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll();
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.post(
        "/announcements",
        AuthMiddleware,
        upload.array("images"),
        async (req: CustomRequest, res: Response, next: NextFunction) => {
          try {
            const forPublic = req.body.forPublic;
            const uploadPromises: any[] = [];
            const tempFilesCreated: string[] = [];
            const options = { folder: "announcements" };
            const folderPath = __dirname + "/upload";
            if (!fs.existsSync(folderPath)) {
              fs.mkdirSync(folderPath);
              console.log("Carpeta creada:", folderPath);
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
                    uploadPromise = cloudinary.v2.uploader.upload(
                      fileName,
                      options
                    );
                    uploadPromises.push(uploadPromise);
                    tempFilesCreated.push(fileName);
                  })
                  .catch((error: any) => {
                    console.log("error jpg", error);
                  });
              } else if (isPNG) {
                await sharp(image.path)
                  .png({ compressionLevel: 5 })
                  .withMetadata()
                  .toFile(fileName)
                  .then(() => {
                    uploadPromise = cloudinary.v2.uploader.upload(
                      fileName,
                      options
                    );
                    uploadPromises.push(uploadPromise);
                    tempFilesCreated.push(fileName);
                  })
                  .catch((error: any) => {
                    console.log("error png", error);
                  });
              }
            }
            const uploadedImages = await Promise.all(uploadPromises);
            console.log("Image uploaded to Cloudinary for announcements");

            const { id: userId } = req.user as { id: number };
              const newAnnouncement = {
                forPublic,
                publicId: uploadedImages[0].public_id,
                imageUrl: uploadedImages[0].secure_url,
              };
    
            const { data } = await service.Create(newAnnouncement);
            tempFilesCreated.forEach((file) => {
              fs.unlinkSync(file);
            });
            return res.status(data?.statusCode || STATUS_CODES.OK).json({
              created: true,
              data,
            });
          } catch (error) {
            console.log(error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
              message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR,
            });
          }
        }
      );

    app.get('/announcements/:id', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll();
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.delete('/announcements/:id', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll();
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });
}