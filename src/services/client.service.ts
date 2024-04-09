import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import {
  Client,
  CreateClient,
  CreateClientEmployee,
  UpdateClient,
} from "../database/models";
import { ClientEmployeeRepository, ClientRepository } from "../database/repos";
import { FormateData } from "../utils";

class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  async Create(client: CreateClient) {
    try {
      const entityCreated = await this.repository.Create(client);
      if ("created" in entityCreated && "message" in entityCreated) {
        return FormateData({
          ...entityCreated,
          statusCode: STATUS_CODES.BAD_REQUEST,
        });
      }
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<UpdateClient>,
    userId: number
  ) {
    try {
      const entryUpdated = await this.repository.Update(
        id,
        dataToUpdate,
        userId
      );
      return FormateData(entryUpdated);
    } catch (error) {
      throw error;
    }
  }

  async GetAll() {
    try {
      return FormateData(await this.repository.GetAll());
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

  async GetEmployeesByClientId(id: number) {
    try {
      return FormateData(await this.repository.GetEmployeesByClientId(id));
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

  async AssignEmployees(
    clientId: number,
    employeeIds: number[],
    userId: number
  ) {
    try {
      const clientEmployeeRepo = new ClientEmployeeRepository();
      const results: any[] = [];
      for (const employeeId of employeeIds) {
        const clientEmployee: CreateClientEmployee = {
          clientId,
          employeeId,
          createdBy: userId,
          isActive: true,
        };

        const entityCreated = await clientEmployeeRepo.Create(clientEmployee);
        results.push(entityCreated);
      }
      let errors = false;
      for (const result of results) {
        if ("created" in result && "message" in result) {
          errors = true;
        }
      }

      return FormateData({
        results,
        message: !errors
          ? RESPONSE_MESSAGES.EMPLOYEES_ASSIGNED
          : results.length === employeeIds.length
          ? RESPONSE_MESSAGES.EMPLOYEES_NOT_ASSIGNED
          : RESPONSE_MESSAGES.EMPLOYEES_ASSIGNED_WITH_ERRORS,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }

  async UnAssignEmployee(
    clientId: number,
    employeeId: number,
  ) {
    try {
      const clientEmployeeRepo = new ClientEmployeeRepository();
      const entityCreated = await clientEmployeeRepo.GetByEmployeeIdAndClientId(employeeId, clientId);
      if (entityCreated) {
        return FormateData(
          await clientEmployeeRepo.UnAssignEmployee(entityCreated.id)
        );
      }
      return FormateData({})
    } catch (error) {
      throw error;
    }
  }
}

export default ClientService;
