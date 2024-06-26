import { CreateReport, CreateReportComment, CreateReportCommentPhoto, Report } from "../database/models";
import { ReportRepository } from "../database/repos";
import { FormateData } from "../utils";
import { PrismaClient } from '@prisma/client';
import PrismaInstance from "../utils/PrismaInstance";

class ReportService {
  private repository: ReportRepository;

  constructor() {
    this.repository = new ReportRepository();
  }

  async Create(entry: CreateReport, identification: string) {
    try {
      const entityCreated = await this.repository.Create(entry, identification);
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

  async GetAll(user: any, status: string, filterDate: string, query: string | null) {
    try {
      let reports: Report[] = [];
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
        reports = await this.repository.GetAll(status, filterDate, query);
      } else if (isClient) {
        reports = await this.repository.GetAllForClient(identification, status, filterDate, query);
      } else if (isEmployee) {
        reports = await this.repository.GetAllForEmployee(identification, status, filterDate, query);
      }
      return FormateData(reports);
    } catch (error) {
      throw error;
    }
  }

  async GetAllOwnReports(userId: number) {
    try {
      return FormateData(await this.repository.GetAllOwnReports(userId));
    } catch (error) {
      throw error;
    }
  }

  async GetTop10ClientReports(clientId: number) {
    try {
      return FormateData(await this.repository.GetTop10ForClient(clientId));
    } catch (error) {
      throw error;
    }
  }

  async GetLastFive(user: any) {
    try {
      let lastReports: Report[] = [];
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
        lastReports = await this.repository.GetLastFive();
      } else if (isClient) {
        console.log("2")
        lastReports = await this.repository.GetLastFiveForClient(
          identification
        );
      } else if (isEmployee) {
        lastReports = await this.repository.GetLastFiveForEmployee(
          identification
        );
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

  async CreateReportComment(entry: CreateReportComment) {
    try {
      const entityCreated = await this.repository.CreateReportComment(entry);
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async CommentReportPhoto(reportPhotoId: number, comments: string, userId: number) {
    try {
      const entityCreated = await this.repository.CommentPhoto(reportPhotoId, comments, userId);
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async CreateReportCommentPhoto(entry: CreateReportCommentPhoto) {
    try {
      const entityCreated = await this.repository.CreateReportCommentPhoto(entry);
      return FormateData(entityCreated);
    } catch (error) {
      throw error;
    }
  }

  async GetCommentsByReportId(id: number) {
    try {
      return FormateData(await this.repository.GetCommentsByReportId(id));
    } catch (error) {
      throw error;
    }
  }

  async DeletePhotoReportById(id: number) {
    try {
      return FormateData(await this.repository.DeletePhotoReportById(id));
    } catch (error) {
      throw error;
    }
  }

  async CompleteReport(reportId: number, userId: number) {
    try {
      const data = await this.repository.CompleteReport(reportId, userId);
      return FormateData(data);
    } catch (error) {
      throw error;
    }
  }
}

export default ReportService;
