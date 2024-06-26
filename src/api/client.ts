import { Request, Response, NextFunction } from 'express';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../constants';
import AuthMiddleware from './middlewares/auth';
import { CustomRequest } from '../database/models';
import { ClientService, LaborAreaService } from '../services';


export default function setupClientRoutes(app: any): void {
    const service = new ClientService();
    
    app.get('/clients', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { query } = req.query as { query: string };
            const { data } = await service.GetAll(req.user, query);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.get('/clients/:id/employees', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(+id)) {
                return res.status(STATUS_CODES.BAD_REQUEST).json({
                    message: 'Client ID is invalid or missing.'
                });
            }

            const { data } = await service.GetEmployeesByClientId(+id);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.post('/clients', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    app.get('/clients/:id', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { data } = await service.GetById(+id);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.put('/clients/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
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

    app.delete('/clients/:id', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
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

    app.post('/clients/:id/employees', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { employeesIds } = req.body;
            const { data } = await service.AssignEmployees(+id!, employeesIds, +userId);
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });

    app.post('/client-unassign-employee', AuthMiddleware, async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { id: userId } = req.user as { id: string };
            const { employeeId, clientId } = req.body;
            const { data } = await service.UnAssignEmployee(
              clientId,
              employeeId
            );
            
            return res.json(data);
        } catch (error) {
            console.error(error);
            res.status(STATUS_CODES.INTERNAL_ERROR).json({
                message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD
            });
        }
    });

    app.post(
      "/client-assign-employee",
      AuthMiddleware,
      async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
          const { id } = req.params;
          const { id: userId } = req.user as { id: string };
          const { employeeId, clientId } = req.body;
          const _employeeId = [employeeId];
          const { data } = await service.AssignEmployees(
            clientId,
            _employeeId,
            +userId
          );
 
          return res.json(data);
        } catch (error) {
          console.error(error);
          res.status(STATUS_CODES.INTERNAL_ERROR).json({
            message: RESPONSE_MESSAGES.ERROR_DELETING_RECORD,
          });
        }
      }
    );

    app.get('/client-information/:identification', AuthMiddleware, async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { identification } = req.params;
            const { data } = await service.GetByIdentification(identification);
            return res.json(data);
        } catch (error) {
            console.error("Error en el servidor:", error);
            return res.status(STATUS_CODES.INTERNAL_ERROR).json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });

    app.post('/batch-clients', AuthMiddleware,  async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
          const { id: createdBy } = req.user as { id: number };
          const { data } = await service.CreateBatch(req.body);
          return res.status(data?.statusCode || STATUS_CODES.OK).json(data);
        } catch (error) {
          console.error("Error en el servidor:", error);
          return res
            .status(STATUS_CODES.INTERNAL_ERROR)
            .json({ message: RESPONSE_MESSAGES.ERROR_500 });
        }
    });
}
