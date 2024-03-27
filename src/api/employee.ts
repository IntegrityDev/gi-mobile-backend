import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { EmployeeService } from '../services';


export default function setupEmployeeRoutes(app: any): void {
    const service = new EmployeeService();
    
    app.get('/employees', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { data } = await service.GetAll();
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.post('/employees', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
          const { id: createdBy } = req.user as { id: string };
          const { data } = await service.Create({
            ...req.body,
            createdBy: createdBy,
          });
          return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
          console.error("Error en el servidor:", error);
          return res
            .status(STATUS_CODES.INTERNAL_ERROR)
            .json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.get('/employees/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.put('/employees/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { data } = await service.Update(+id!, req.body, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });

    app.delete('/employees/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(+id)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: 'Employee ID is invalid or missing.'
                });
            }

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
