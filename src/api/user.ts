import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services'; 
import { STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';


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

    app.get('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
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
}
