import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest, Report } from '../database/models';
import { DocumentTypeService, ReportPhotoService, ReportService } from '../services';


export default function setupRequestsRoutes(app: any): void {
    const service = new ReportService();
    
    app.get('/client-requests', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll(1);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/client-requests/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/client-requests/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    app.post('/client-requests', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id: userId } = req.user as { id: number };
            const newReport = {
                ...req.body,
                createdBy: userId,
                isDeleted: false
            }

            const { data } = await service.Create(newReport);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.get('/employee-requests', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            //const { id: userId } = req.user;
            const { data } = await service.GetAll(1);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/employee-requests/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/employee-requests/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    app.post('/employee-requests', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id: userId } = req.user as { id: number };
            const newReport = {
                ...req.body,
                createdBy: userId,
                isDeleted: false
            }

            const { data } = await service.Create(newReport);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.get('/employee-request-types', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            //const { id: userId } = req.user;
            const documentService = new DocumentTypeService();
            const { data } = await documentService.GetRequestTypes(true)
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/client-request-types', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const documentService = new DocumentTypeService();
            const { data } = await documentService.GetRequestTypes(false)
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });
}
