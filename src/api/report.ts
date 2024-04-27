import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest, Report } from '../database/models';
import { ReportPhotoService, ReportService } from '../services';
import { PrismaClient } from '@prisma/client';

export default function setupReportRoutes(app: any): void {
    const service = new ReportService();
    
    app.get('/reports', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { status: filterStatus, filterDate, query }: { status: string, filterDate: string, query: string | null } = req.query as { status: string, filterDate: string, query: string | null };
            const { data } = await service.GetAll(req.user, filterStatus, filterDate, query);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/reports/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/reports/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    app.post('/reports', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id: userId, identification } = req.user as { id: number, identification: string };
            const newReport = {
                ...req.body,
                createdBy: userId,
                isDeleted: false
            }

            const { data } = await service.Create(newReport, identification);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.put('/reports/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const reqBody = { ...req.body }
            const { data } = await service.Update(+id!, reqBody, +userId);
            return res.json(data);

        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.get('/lasts-reports', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetLastFive(req.user);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.post('/report-comments', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id: userId, identification } = req.user as { id: number, identification: string };
            const newReportComment = {
                ...req.body,
                createdBy: userId,
                isDeleted: false,
                employeeId: identification
            }

            const { data } = await service.CreateReportComment(newReportComment);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.get('/reports-comments/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetCommentsByReportId(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.delete('/reports-photo/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.DeletePhotoReportById(+id);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });

    app.get('/own-reports', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
          const { id: userId } = req.user;
          const { data } = await service.GetAllOwnReports(userId);
          return res.json(data);
        } catch (error) {
          next(error);
        }
    });

    app.get('/reports-client/:clientId', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { clientId } = req.params;
            const { data } = await service.GetTop10ClientReports(+clientId);
            return res.json(data);
        } catch (error) {
            next(error);
        }
    });
    
    app.post('/complete-report', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {

            const { id: userId, identification } = req.user as { id: number, identification: string };
            const {
                reportId
            } = req.body

            const { data } = await service.CompleteReport(reportId, userId);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });

    app.post('/comment-photo', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id: userId, identification, name } = req.user as { id: number, identification: string, name: string };
            const { reportPhotoId, comments, commentDate} = req.body;
            const _newComments = `${name}, ${commentDate}{NEW_LINE}${comments}`;
            const { data } = await service.CommentReportPhoto(reportPhotoId, _newComments, userId);
            return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
            console.log(error)
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.REQUEST_PROCESSING_ERROR 
            });
        }
    });
}
