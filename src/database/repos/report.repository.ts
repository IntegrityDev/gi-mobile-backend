import { PrismaClient } from "@prisma/client";
import {
  CreateReport,
  CreateReportComment,
  CreateReportCommentPhoto,
  Report,
  ReportComment,
  ReportCommentPhoto,
  ReportPhoto,
} from "../models";
import PrismaInstance from "../../utils/PrismaInstance";
import reportEmitter from "../../events/report.events";

class ReportRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(
    report: CreateReport,
    identification: string
  ): Promise<Report | null> {
    try {
      if (identification) {
        const employee = await this.prisma.employees.findFirst({
          where: {
            identification,
          },
        });
        if (!employee) {
          return null;
        }
        const reportCreated = await this.prisma.reports.create({
          data: {
            ...report,
            employeeId: employee?.id,
            isCompleted: false,
          },
          include: {
            clients: true,
            employees: true,
          },
        });

        if (reportCreated) {
          reportEmitter.emit("report-created", reportCreated);
        }
        return reportCreated;
      }

      return null;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<Report>,
    userId: number
  ): Promise<Report | null> {
    try {
      const updated = await this.prisma.reports.update({
        where: {
          id,
        },
        data: dataToUpdate,
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetAll(status: string, filterDate: string, query: string| null): Promise<Report[]> {
    let whereConditions: any = this.getFilters(status, filterDate, query);

    try {
      return await this.prisma.reports.findMany({
        where: whereConditions,
        include: {
          laborAreas: true,
          clients: true,
          employees: true,
          reportPhotos: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAllOwnReports(userId: number): Promise<Report[]> {
    try {
      return await this.prisma.reports.findMany({
        where: {
          createdBy: userId,
        },
        include: {
          laborAreas: true,
          clients: true,
          employees: true,
          reportPhotos: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetTop10ForClient(clientId: number): Promise<Report[]> {
    try {
      const clientReports = await this.prisma.reports.findMany({
        where: {
          clientId: clientId,
        },
        include: {
          laborAreas: true,
          clients: true,
          employees: true,
          reportPhotos: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return clientReports;
    } catch (error) {
      throw error;
    }
  }

  async GetAllForClient(identification: string, status: string, filterDate: string, query: string | null): Promise<Report[]> {
    try {
      let whereConditions: any = this.getFilters(status, filterDate, query);
      const client = await this.prisma.clients.findFirst({
        where: {
          identification,
        },
      });

      if (!client) {
        return [];
      }
      whereConditions.clientId = client.id;
      const clientReports = await this.prisma.reports.findMany({
        where: whereConditions,
        include: {
          laborAreas: true,
          clients: true,
          employees: true,
          reportPhotos: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return clientReports;
    } catch (error) {
      throw error;
    }
  }

  async GetAllForEmployee(identification: string, status: string, filterDate: string, query: string | null): Promise<Report[]> {
    try {
      let whereConditions: any = this.getFilters(status, filterDate, query)
      const employee = await this.prisma.employees.findFirst({
        where: { identification },
      });

      if (employee) {
        const clientEmployee = await this.prisma.clientEmployees.findFirst({
          where: {
            employeeId: employee.id,
            isActive: true,
          },
        });

        if (clientEmployee) {
          const client = await this.prisma.clients.findFirst({
            where: {
              id: clientEmployee.clientId,
            },
          });

          if (!client) {
            return [];
          }
          whereConditions.clientId = client.id;
          const clientReports = await this.prisma.reports.findMany({
            where: {
              clientId: client.id,
            },
            include: {
              laborAreas: true,
              clients: true,
              employees: true,
              reportPhotos: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          return clientReports;
        }
      }

      return [];
    } catch (error) {
      throw error;
    }
  }

  async GetLastFive(): Promise<Report[]> {
    try {
      return await this.prisma.reports.findMany({
        where: {
          isCompleted: false
        },
        include: {
          laborAreas: true,
          reportPhotos: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    } catch (error) {
      throw error;
    }
  }

  async GetLastFiveForClient(identification: string): Promise<Report[]> {
    try {
      const client = await this.prisma.clients.findFirst({
        where: {
          identification,
        },
      });

      if (!client) {
        return [];
      }
      const clientReports = await this.prisma.reports.findMany({
        where: {
          clientId: client.id,
          isCompleted: false
        },
        include: {
          laborAreas: true,
          reportPhotos: true,
          clients: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      return clientReports;
    } catch (error) {
      throw error;
    }
  }

  async GetLastFiveForEmployee(identification: string): Promise<Report[]> {
    try {
      const employee = await this.prisma.employees.findFirst({
        where: { identification },
      });

      if (employee) {
        const clientEmployee = await this.prisma.clientEmployees.findFirst({
          where: {
            employeeId: employee.id,
            isActive: true,
          },
        });

        if (clientEmployee) {
          const client = await this.prisma.clients.findFirst({
            where: {
              id: clientEmployee.clientId,
            },
          });

          if (!client) {
            return [];
          }
          const clientReports = await this.prisma.reports.findMany({
            where: {
              clientId: client.id,
              isCompleted: false
            },
            include: {
              laborAreas: true,
              reportPhotos: true,
              clients: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          });

          return clientReports;
        }
      }

      return [];
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Report | null> {
    try {
      return await this.prisma.reports.findFirst({
        where: {
          id,
        },
        include: {
          laborAreas: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async CreateReportComment(
    report: CreateReportComment
  ): Promise<ReportComment | null> {
    try {
      const userEntry = await this.prisma.reportComments.create({
        data: report,
        include: {
          employees: true,
        },
      });

      if (userEntry) {
        reportEmitter.emit("report-commented", userEntry);
      }

      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async CreateReportCommentPhoto(
    report: CreateReportCommentPhoto
  ): Promise<ReportCommentPhoto | null> {
    try {
      const userEntry = await this.prisma.reportCommentPhotos.create({
        data: report
      });

      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async GetCommentsByReportId(id: number): Promise<ReportComment[] | null> {
    try {
      return await this.prisma.reportComments.findMany({
        where: {
          reportId: id,
        },
        include: {
          employees: true,
          reportCommentPhotos: true
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Report | null> {
    try {
      const deleted = await this.prisma.reports.delete({
        where: {
          id,
        },
      });
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  async CompleteReport(
    reportId: number,
    userId: number
  ): Promise<Report | null> {
    try {
      return await this.prisma.reports.update({
        where: {
          id: reportId,
        },
        data: {
          isCompleted: true,
          modifiedBy: userId,
          modifiedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async CommentPhoto(
    reportPhotoId: number,
    comments: string,
    userId: number
  ): Promise<ReportPhoto | null> {
    try {
      return await this.prisma.reportPhotos.update({
        where: {
          id: reportPhotoId,
        },
        data: {
          comments,
          modifiedBy: userId,
          modifiedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  private getFilters(status: string, filterDate: string, query: string | null) {
    let whereConditions: any = {}
    if (status !== "all") {
      if (status === "open") {
        whereConditions.isCompleted = false;
      } else if (status === "completed") {
        whereConditions.isCompleted = true;
      }
    }
    if (filterDate !== "all") {
      if (filterDate === "thisMonth") {
        const startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        whereConditions.createdAt = { gte: startDate, lt: endDate };
      } else if (filterDate === "previousMonth") {
        const currentDate = new Date();
        const startOfMonthLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          1
        );
        const endOfMonthLastMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        );
        whereConditions.createdAt = {
          gte: startOfMonthLastMonth,
          lt: endOfMonthLastMonth,
        };
      } else if (filterDate === "thisYear") {
        const currentDate = new Date();
        const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const endOfYear = new Date(currentDate.getFullYear() + 1, 0, 1);
        whereConditions.createdAt = { gte: startOfYear, lt: endOfYear };
      }
    }

    if (query) {
      whereConditions = {
        ...whereConditions,
        OR: [
          {
            laborAreas: {
              name: {
                contains: query.trim(),
              },
            },
          },
          {
            clients: {
              name: {
                contains: query.trim(),
              },
            },
          },
        ],
      };
    }

    return whereConditions
  }
}

export default ReportRepository;
