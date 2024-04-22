import { STATUS_CODES } from "../constants";
import { CreateClientEmployee, CreateEmployee, Employee, UpdateEmployee } from "../database/models";
import { ClientEmployeeRepository, EmployeeRepository } from "../database/repos";
import { FormateData } from "../utils";

class EmployeeService {
    private repository: EmployeeRepository;

    constructor() {
        this.repository = new EmployeeRepository();
    }

    async Create(entry: CreateEmployee) {     
        try {
            const entityCreated = await this.repository.Create(entry);
            if ('created' in entityCreated && 'message' in entityCreated) {
                return FormateData({
                    ...entityCreated,
                    created: false,
                    statusCode: STATUS_CODES.OK
                })
            }
            return FormateData({
              ...entityCreated,
              created: true,
              message: "Empleado creado correctamente",
            });
        } catch (error) {
            throw error;
        }
    }

    async CreateBatch(entry: CreateEmployee[]) {     
        try {
            const entityCreated = await this.repository.CreateMany(entry);
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<UpdateEmployee>, userId: number) {
        try {
            const entryUpdated = await this.repository.Update(id, dataToUpdate, userId);
            return FormateData(entryUpdated);
        } catch (error) {
            throw error;
        }
    }

    async GetAll(user: any, query: string | null, supervisors = false) {
        try {
            const {
                identification,
                id: userId,
                isSupervisor,
                isSuperAdmin,
                isAdmin,
                isClient,
              } = user;   

              if (isSuperAdmin || isSupervisor || isAdmin) {
                return FormateData(await this.repository.GetAll(query, supervisors));
              } else if (isClient) {
                  return FormateData(
                    await this.repository.GetByClientIdentification(
                      identification
                    )
                  );
              } 
              return FormateData([])            
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number) {
        try {
            return FormateData(await this.repository.GetById(id));
        } catch (error) {
            throw error;
        }
    }

    async GetSupervisorById(id: number) {
        try {
            return FormateData(await this.repository.GetSupervisorById(id));
        } catch (error) {
            throw error;
        }
    }

    async GetByIdentification(identification: string) {
        try {
            return FormateData(await this.repository.GetByIdentification(identification));
        } catch (error) {
            throw error;
        }
    }

    async ValidateEmployee(identification: string) {
        try {
            return FormateData(await this.repository.ValidateEmployee(identification));
        } catch (error) {
            throw error;
        }
    }

    async GetByClientId(clientId: number) {
        try {
            return FormateData(await this.repository.GetByClientId(clientId));
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number) {
        try {
            const data = await this.repository.Delete(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }

    async AssignClient(employeeId: number, clientId: number, userId: number) {  
        try {
            const clientEmployeeRepo = new ClientEmployeeRepository();
            const clientEmployee: CreateClientEmployee = {
                clientId,
                employeeId,
                createdBy: userId,
                isActive: true
            }
            const entityCreated = await clientEmployeeRepo.Create(clientEmployee);
            if ('created' in entityCreated && 'message' in entityCreated) {
                return FormateData({
                    ...entityCreated,
                    statusCode: STATUS_CODES.BAD_REQUEST
                })
            }
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }

    async RemoveClient(employeeId: number, clientId: number, userId: number) {  
        try {
            const clientEmployeeRepo = new ClientEmployeeRepository();
            const clientEmployee: CreateClientEmployee = {
                clientId,
                employeeId,
                createdBy: userId,
                isActive: true
            }
            const entityCreated = await clientEmployeeRepo.Delete(clientId, employeeId, userId);
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }
}

export default EmployeeService;
