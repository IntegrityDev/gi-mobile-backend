import { Request, Response, NextFunction } from 'express';
import { UserProfileService, UserService } from '../services'; 
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
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
}
