import { Request, Response, NextFunction } from "express";
import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import AuthMiddleware from "./middlewares/auth";
import { CustomRequest } from "../database/models";
import {
  ReportCommentPhotoService,
  ReportCommentService,
  ReportPhotoService,
  ReportService,
} from "../services";
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
export default function setupReportPhotoRoutes(app: any): void {
  const service = new ReportPhotoService();

  app.get(
    "/reports-photos",
    AuthMiddleware,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        //const { id: userId } = req.user;
        const { data } = await service.GetAll(1);
        return res.json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/reports-photos/:reportId",
    AuthMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { reportId } = req.params;
        const { data } = await service.GetByReportId(+reportId);
        return res.json(data);
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/reports-photos/:id",
    AuthMiddleware,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const { id: userId } = req.user as { id: string };
        const { data } = await service.Delete(+id!, +userId);
        return res.json(data);
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_ERROR).json({
          message: "Error deleting user alert",
        });
      }
    }
  );

  app.post(
    "/reports-photos",
    AuthMiddleware,
    upload.array("images"),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const reportId = req.body.reportId;
        const uploadPromises: any[] = [];
        const tempFilesCreated: string[] = [];
        const options = { folder: "reports" };
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
        console.log("Images uploaded to Cloudinary");

        const reportPhotos = [];
        const { id: userId } = req.user as { id: number };
        for (const uploadedImage of uploadedImages) {
          const newReportPhoto = {
            reportId: +reportId,
            publicId: uploadedImage.public_id,
            imageUrl: uploadedImage.secure_url,
            secureUrl: uploadedImage.secure_url,
            url: uploadedImage.secure_url,
            createdBy: userId,
            isDeleted: false,
          };

          reportPhotos.push(newReportPhoto);
        }

        const { data } = await service.Create(reportPhotos);
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

  app.post(
    "/report-comment-photo",
    AuthMiddleware,
    upload.array("images"),
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { identification } = req.user;
        const { reportId, comments } = req.body;
        const uploadPromises: any[] = [];
        const tempFilesCreated: string[] = [];
        const options = { folder: "reports" };
        const folderPath = __dirname + "/upload";
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath);
          console.log("Created folder:", folderPath);
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
        console.log("Images uploaded to Cloudinary");

        const reportPhotos = [];
        const { id: userId } = req.user as { id: number };
        for (const uploadedImage of uploadedImages) {
          const newReportPhoto = {
            reportId: +reportId,
            publicId: uploadedImage.public_id,
            imageUrl: uploadedImage.secure_url,
            secureUrl: uploadedImage.secure_url,
            url: uploadedImage.secure_url,
            createdBy: userId,
            isDeleted: false,
          };

          reportPhotos.push(newReportPhoto);
        }
        const reportCommentService = new ReportService();
        const newReportComment = {
          createdBy: userId,
          isDeleted: false,
          employeeId: identification,
          comments,
          reportId: +reportId,
        };
        tempFilesCreated.forEach((file) => {
          fs.unlinkSync(file);
        });
        const reportCommentSaved =
          await reportCommentService.CreateReportComment(newReportComment);
        if (reportCommentSaved) {
          const { data: _reportComment } = reportCommentSaved;
          const { data: _reportPhoto } = 
            await reportCommentService.CreateReportCommentPhoto({
              createdBy: userId,
              imageUrl: reportPhotos[0]?.secureUrl,
              isDeleted: false,
              reportCommentId: _reportComment.id,
            });
          if (_reportPhoto) {
            return res.json({
              created: true, 
              _reportPhoto,
            });
          } else {
            return res.json({
              created: false,
              message: "El comentario no pudo ser creado",
            });
          }
        } else {
          return res.json({
            created: false,
            message: "El comentario no pudo ser creado",
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
