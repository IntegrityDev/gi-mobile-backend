import { CreateVisit, Visit } from "../database/models";
import { VisitRepository } from "../database/repos";
import { FormateData } from "../utils";

class VisitService {
    private repository: VisitRepository;

    constructor() {
        this.repository = new VisitRepository();
    }

    async Create(entry: CreateVisit) {     
        try {
            const entityCreated = await this.repository.Create(entry);
            return FormateData(entityCreated);
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: any, userId: number) {
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

    async Delete(id: number, userId: number) {
        try {
            const data = await this.repository.Delete(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }
}

export default VisitService;
