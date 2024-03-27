import { ReportComment } from "../database/models";
import { ReportCommentRepository } from "../database/repos";
import { FormateData } from "../utils";

class ReportCommentService {
    private repository: ReportCommentRepository;

    constructor() {
        this.repository = new ReportCommentRepository();
    }

    async Create(entry: ReportComment) {     
        try {
            const entityCreated = await this.repository.Create(entry);
            return entityCreated;
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

    async GetAll(userId: number) {
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

    async Delete({ id, userId }: { id: number, userId: number }) {
        try {
            const data = await this.repository.Delete(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }
}

export default ReportCommentService;
