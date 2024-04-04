import { Request, Response, NextFunction } from 'express';
import { VisitService } from '../services'; 
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';


export default function setupVisitRoutes(app: any): void {
    const service = new VisitService();
    
    app.get('/visits', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll(req.user);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/visits/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/visits/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { data } = await service.Delete(+id!, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: "Error deleting user alert"
            });
        }
    });

    app.post('/visits', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const newVisit = {
                ...req.body,
                employeeId: 1,
                timeVisit: new Date(),
                isDeleted: false
            }
           
            const { data } = await service.Create(newVisit);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });
}
