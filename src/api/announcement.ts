import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { AnnouncementService } from '../services';


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

    app.post('/announcements', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.Create(req.body);
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

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