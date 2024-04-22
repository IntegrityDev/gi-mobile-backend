import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { SummaryService } from '../services';


export default function setupSummaryRoutes(app: any): void {
    const service = new SummaryService();
    
    app.get('/summary', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data: reports } = await service.GetAll();
            const { data: counts } = await service.GetCounts();
            return res.json({
                reports,
                counts
            });
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        } 
    });
}