import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services'; 
// import { STATUS_CODES } from '../utils/status-codes';
// import UserAuth from './middlewares/auth';

export default function setupUserRoutes(app: any): void {
    const service = new UserService();
    //UserAuth middleware
    // app.get('/users', async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { id: userId } = req.user as { id: string };
    //         const { data } = await service.GetAllAlertsByUserId(userId);
    //         return res.json({
    //             data
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // });

    app.post('/users', async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const { id: userId } = req?.user as { id: string };
            const response = await service.CreateUser(req.body);
            return res.status(201).json({
                response
            });
        } catch (error) {
            next(error);
        }
    });

    // app.get('/alerts/:id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { id } = req.params;
    //         const { data } = await service.GetAlertById({ id });
    //         return res.json({
    //             data
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // });

    // app.put('/alerts/:id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { id } = req.params;
    //         const { id: userId } = req.user as { id: string };
    //         const { data } = await service.UpdateAlert(id, req.body, userId);
    //         return res.json({
    //             data
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // });

    // app.delete('/alerts/:id', UserAuth, async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { id } = req.params;
    //         const { id: userId } = req.user as { id: string };
    //         const { data } = await service.DeleteAlert({ id, userId });
    //         return res.json({
    //             data
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(STATUS_CODES.INTERNAL_ERROR).json({
    //             message: "Error deleting user alert"
    //         });
    //     }
    // });
}
