import { PrismaClient } from "@prisma/client";
import { LaborArea } from "../models";
import PrismaInstance from "../../utils/PrismaInstance";

class SummaryRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async getMonthlyReportStatus() {
    try {
      const monthlyReportStatus = await this.prisma.$queryRaw`
       SELECT
        CASE
          WHEN MONTH(createdAt) = 1 THEN 'Enero'
          WHEN MONTH(createdAt) = 2 THEN 'Febrero'
          WHEN MONTH(createdAt) = 3 THEN 'Marzo'
          WHEN MONTH(createdAt) = 4 THEN 'Abril'
          WHEN MONTH(createdAt) = 5 THEN 'Mayo'
          WHEN MONTH(createdAt) = 6 THEN 'Junio'
          WHEN MONTH(createdAt) = 7 THEN 'Julio'
          WHEN MONTH(createdAt) = 8 THEN 'Agosto'
          WHEN MONTH(createdAt) = 9 THEN 'Septiembre'
          WHEN MONTH(createdAt) = 10 THEN 'Octubre'
          WHEN MONTH(createdAt) = 11 THEN 'Noviembre'
          WHEN MONTH(createdAt) = 12 THEN 'Diciembre'
        END AS month,
        SUM(CASE WHEN isCompleted = true THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN isCompleted = false THEN 1 ELSE 0 END) AS uncompleted
      FROM
        reports
      WHERE
        YEAR(createdAt) = YEAR(CURRENT_DATE())
      GROUP BY
        MONTH(createdAt)
      ORDER BY
        MONTH(createdAt);`;
      return monthlyReportStatus;
    } catch (error) {
      console.error('Error al obtener el estado mensual del informe:', error);
      throw error;
    }
  }

  async GetCounts(): Promise<any> {
    try {
      const employees = await this.prisma.employees.count();
      const clientRequests = await this.prisma.clientsRequests.count();
      const employeeRequests = await this.prisma.employeeRequests.count();
      const clients = await this.prisma.clients.count();

      return {
        employees,
        clients,
        clientRequests,
        employeeRequests,
      };
    } catch (error) {
      throw error;
    }
  }

}

export default SummaryRepository;
