import { PrismaClient } from "@prisma/client";
import { CreateVisit, Report, Visit } from "../models";

class VisitRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async Create(visit: CreateVisit): Promise<Visit> {
    try {
      const userEntry = await this.prisma.visits.create({
        data: visit,
        include: {
          clients: true,
        },
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<Visit>,
    userId: number
  ): Promise<Visit | null> {
    try {
      const updated = await this.prisma.visits.update({
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

  async GetAll(): Promise<Visit[]> {
    try {
      return await this.prisma.visits.findMany({
        include: {
          employees: true,
          clients: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAllReportsForEmployees(identification: string): Promise<any[]> {
    try {
      const employee = await this.prisma.employees.findFirst({
        where: {
          identification,
        },
      });

      if (employee) {
        const clientEmployee = await this.prisma.clientEmployees.findFirst({
          where: {
            employeeId: employee.id,
          },
        });

        if (!clientEmployee) {
          return [];
        }

        const client = await this.prisma.clients.findFirst({
          where: {
            id: clientEmployee.clientId!,
          },
        });

        if (!client) {
          return [];
        }

        const reportClient = await this.prisma.reports.findMany({
          where: {
            visits: {
              clientId: client.id,
            },
          },
          include: {
            laborAreas: true,
            reportPhotos: true,
            visits: {
              include: {
                clients: true,
                employees: true
              }
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

         return reportClient
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async GeAllReportsForClient(identification: string): Promise<Report[]> {
    try {
      const client = await this.prisma.clients.findFirst({
        where: {
          identification,
        },
      });

      if (!client) {
        return [];
      }
      let clientReports = await this.prisma.reports.findMany({
        where: {
          visits: {
            clientId: client.id,
          },
        },
        include: {
          laborAreas: true,
          reportPhotos: true,
          visits: {
            include: {
              clients: true
            }
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (clientReports) {
        clientReports = { ...clientReports, ...client };
      }

      return clientReports;
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Visit | null> {
    try {
      return await this.prisma.visits.findFirst({
        where: {
          id,
        },
        include: {
          clients: true,
          employees: true,
          reports: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Visit | null> {
    try {
      const deleted = await this.prisma.visits.delete({
        where: {
          id,
        },
      });
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default VisitRepository;
