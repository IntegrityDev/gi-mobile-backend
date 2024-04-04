import { CreateReport, Report } from "../database/models";
import { ReportRepository } from "../database/repos";
import { FormateData } from "../utils";

class ReportService {
    private repository: ReportRepository;

    constructor() {
        this.repository = new ReportRepository();
    }

    async Create(entry: CreateReport) {     
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

    async GetLastFive(user: any) {
        try {
            let lastReports: Report[] = []
            const {
              identification,
              id: userId,
              isSupervisor,
              isSuperAdmin,
              isAdmin,
              isClient,
              isEmployee,
            } = user;

            if (isSuperAdmin || isSupervisor || isAdmin) {
                lastReports = await this.repository.GetLastFive()
            } else if (isClient) {
                lastReports = await this.repository.GetLastFiveForClient(identification);
            } else if (isEmployee) {
                lastReports = await this.repository.GetLastFiveForEmployee(identification);
            }
            return FormateData(lastReports);
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

export default ReportService;
