import { ClientRequest, EmployeeRequest } from "../database/models";
import { RequestRepository } from "../database/repos";
import { FormateData } from "../utils";

class RequestService {
  private repository: RequestRepository;

  constructor() {
    this.repository = new RequestRepository();
  }

  async CreateEmployeeRequest(entry: EmployeeRequest) {
    try {
      const entityCreated = await this.repository.CreateEmployeeRequest(entry);
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async CreateClientRequest(entry: ClientRequest) {
    try {
      const entityCreated = await this.repository.CreateClientRequest({
        ...entry,
        request: entry?.observations!,
      });
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async CommentEmployeeRequest(
    idRequest: number,
    comments: string,
    isClosed: boolean,
    userId: number
  ) {
    try {
      const entityCreated = await this.repository.CommentEmployeeRequest(
        idRequest,
        comments,
        isClosed,
        userId
      );
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async CommentClientRequest(
    idRequest: number,
    comments: string,
    isClosed: boolean,
    userId: number
  ) {
    try {
      const entityCreated = await this.repository.CommentClientRequest(
        idRequest,
        comments,
        isClosed,
        userId
      );
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async Update(id: number, dataToUpdate: any, userId: number) {
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

  async GetRequests(user: any) {
    try {
      const {
        isEmployee,
        isClient,
        isSupervisor,
        isAdmin,
        isSuperAdmin,
        identification,
      } = user;
      if (isSuperAdmin || isAdmin) {
        return FormateData(await this.repository.GetAll());
      } else if (isSupervisor || isEmployee) {
        return FormateData(
          await this.repository.GetOwnRequests(identification)
        );
      } else if (isClient) {
        return FormateData(
          await this.repository.GetClientRequests(identification)
        );
      }
      return FormateData([]);
    } catch (error) {
      throw error;
    }
  }

  async GetClientRequests(user: any) {
    try {
      const {
        isEmployee,
        isClient,
        isSupervisor,
        isAdmin,
        isSuperAdmin,
        identification,
      } = user;
      if (isSuperAdmin || isAdmin) {
        return FormateData(await this.repository.GetAllClientRequests());
      }
      return FormateData([]);
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

  async GetClientRequestById(id: number) {
    try {
      return FormateData(await this.repository.GetClientRequestById(id));
    } catch (error) {
      throw error;
    }
  }

  async Delete({ id, userId }: { id: number; userId: number }) {
    try {
      const data = await this.repository.Delete(id, userId);
      return FormateData(data);
    } catch (error) {
      throw error;
    }
  }

  async GetClientRequestResponses(id: number) {
    try {
        return FormateData(await this.repository.GetClientRequestResponses(id));
    } catch (error) {
      throw error;
    }
  }

  async GetEmployeeRequestResponses(id: number) {
    try {
      return FormateData(await this.repository.GetEmployeeRequestResponses(id));
    } catch (error) {
      throw error;
    }
  }
}

export default RequestService;
