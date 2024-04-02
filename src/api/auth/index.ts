import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants';

export default function setupAuthRoutes(app: any): void {
    const service = new AuthService();

    app.post('/auth/signup', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.SignUp(req.body);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR
            });
        }
    });

    app.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.SignIn(req.body);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post('/auth/reset-password', async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const { data } = await service.ResetPassword(req.body);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });
    
    app.post('/auth/change-password', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.SignIn(req.body);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });
}
