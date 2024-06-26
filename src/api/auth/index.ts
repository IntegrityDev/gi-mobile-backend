import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../../constants';
import AuthMiddleware from '../middlewares/auth';
import { CustomRequest } from '../../database/models';

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

    app.post('/auth/logout', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { identification } = req.user;
            const { data } = await service.SignOut(identification);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post('/auth/expo-token', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { identification } = req.user;
            const {expoToken} = req.body;
            const { data } = await service.ExpoToken(identification, expoToken);
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
    
    app.post('/auth/auth-change-password', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.SignIn(req.body);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post('/auth/change-password', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {identification, email, password, code } = req.body;
            const { data } = await service.ChangePasswordAfterVerifiedCode(
              identification,
              email,
              password,
              code
            );
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
              message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR,
            });
        }
    });
    
    app.post('/auth/verify-code', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, code } = req.body;
            const { data } = await service.VerifyCode(email, code);
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post('/auth/activate-user', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identification, code, expoToken } = req.body;
            const { data } = await service.VerifyActivationCode(
              identification,
              code
            );
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR
            });
        }
    });

    app.post('/auth/resend-activation-code', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identification } = req.body;
            const { data } = await service.ResendActivationCode(
              identification
            );
            return res.status(data?.statusCode).json(data);
        } catch (error) {
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR
            });
        }
    });
}
