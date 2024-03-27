import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { ProfileService } from '../services';


export default function setupProfileRoutes(app: any): void {
    const service = new ProfileService();
    
    app.get('/profiles', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id: userId } = req.user;
            const { data } = await service.GetAll(userId);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.get('/profiles/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.delete('/profiles/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { data } = await service.Delete(+id!, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });
}
