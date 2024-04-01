import { CreateReportPhoto, ReportPhoto } from "../database/models";
import { ReportPhotoRepository } from "../database/repos";
import { FormateData } from "../utils";

class ReportPhotoService {
    private repository: ReportPhotoRepository;

    constructor() {
        this.repository = new ReportPhotoRepository();
    }

    async Create(entry: CreateReportPhoto[]) {     
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

    async GetAll(userId: number) {
        try {
            return FormateData(await this.repository.GetAll());
        } catch (error) {
            throw error;
        }
    }

    async GetByReportId(id: number) {
        try {
            return FormateData(await this.repository.GetByReportId(id));
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number ) {
        try {
            const data = await this.repository.Delete(id, userId);
            return FormateData(data);
        } catch (error) {
            throw error;
        }
    }
}

export default ReportPhotoService;
