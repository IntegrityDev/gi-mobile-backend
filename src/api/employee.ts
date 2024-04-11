import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { EmployeeService } from '../services';


export default function setupEmployeeRoutes(app: any): void {
    const service = new EmployeeService();
    
    app.get('/employees', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { query } = req.query as { query: string | null };
            const { data } = await service.GetAll(req.user, query);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.get('/supervisors', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { query } = req.query as { query: string | null };
            const { data } = await service.GetAll(req.user, query, true);
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

    app.get('/supervisors/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetSupervisorById(+id);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.get('/employees-client/:clientId', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { clientId } = req.params;
            const { data } = await service.GetByClientId(+clientId);
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
            const reqBody = { ...req.body }
            const { data } = await service.Update(+id!, reqBody, +userId);
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

    app.post('/employees/:id/client', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { clientId } = req.body;
            const { data } = await service.AssignClient(+id!, clientId, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });

    app.delete('/employees/:id/client', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { clientId } = req.body;
            const { data } = await service.RemoveClient(+id!, clientId, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });

    app.get('/my-information/:identification', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identification } = req.params;
            const { data } = await service.GetByIdentification(identification);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });
}
