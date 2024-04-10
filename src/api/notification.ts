import { Request, Response, NextFunction } from "express";
import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import AuthMiddleware from "./middlewares/auth";
import { CustomRequest } from "../database/models";
import { NotificationService } from "../services";

export default function setupNotificationRoutes(app: any): void {
  const service = new NotificationService();

  app.get(
    "/notifications",
    AuthMiddleware,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { identification } = req.user;
        const { data } = await service.GetAll(identification);
        return res.json(data);
      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );

  app.get(
    "/top-notifications",
    AuthMiddleware,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { identification } = req.user;
        const { data } = await service.GetTops(identification);
        return res.json(data);
      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );

  app.get(
    "/last-notifications",
    AuthMiddleware,
    async (req: CustomRequest, res: Response, next: NextFunction) => {
      try {
        const { identification } = req.user;
        const { data } = await service.GetLast(identification);
        return res.json(data);
      } catch (error) {
        console.error("Error en el servidor:", error);
        return res
          .status(STATUS_CODES.INTERNAL_ERROR)
          .json({ message: RESPONSE_MESSAGES.ERROR_500 });
      }
    }
  );

  app.post('/notifications', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { notificationId } = req.body;        
        const { data } = await service.ReadNotification(notificationId);
        return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
    } catch (error) {
        console.log(error);
        return res.status(STATUS_CODES.INTERNAL_ERROR).json({
            message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
        });
    }
});
}
