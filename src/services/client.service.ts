import { STATUS_CODES } from "../constants";
import { Client, CreateClient, UpdateClient } from "../database/models";
import { ClientRepository } from "../database/repos";
import { FormateData } from "../utils";

class ClientService {
    private repository: ClientRepository;

    constructor() {
        this.repository = new ClientRepository();
    }

    async Create(client: CreateClient) {     
        try {
            const entityCreated = await this.repository.Create(client);
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

    async Update(id: number, dataToUpdate: Partial<UpdateClient>, userId: number) {
        try {
            const entryUpdated = await this.repository.Update(id, dataToUpdate, userId);
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
}

export default ClientService;
