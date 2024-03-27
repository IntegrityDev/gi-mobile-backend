import { PrismaClient } from "@prisma/client";
import {
  ClientEmployee,
  CreateClientEmployee,
  CustomError,
  Employee,
} from "../models";
import { RESPONSE_MESSAGES } from "../../constants";

class ClientEmployeeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async Create(
    clientEmployee: CreateClientEmployee
  ): Promise<ClientEmployee | CustomError> {
    let customError: CustomError;
    try {
      const existingClientEmployee =
        await this.prisma.clientEmployees.findFirst({
          where: {
            clientId: clientEmployee.clientId,
            employeeId: clientEmployee.employeeId,
            isActive: true,
          },
        });

      if (existingClientEmployee) {
        const employee = await this.prisma.employees.findUnique({
            where: {
                id: existingClientEmployee.employeeId
            }
        })
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.EMPLOYEE_ALREADY_ASSIGNED.replace("{identification}", employee?.identification || ""),
        };
        return customError;
      }

      const newClient = await this.prisma.clientEmployees.create({
        data: clientEmployee,
      });
      return newClient;
    } catch (error) {
      throw error;
    }
  }

  async GetClientByEmployeeId(
    employeeId: number
  ): Promise<ClientEmployee | null> {
    try {
      const existsClientEmployee = await this.prisma.clientEmployees.findFirst({
        where: {
          employeeId,
          isActive: true,
        },
      });

      if (existsClientEmployee) {
        const client = await this.prisma.clients.findUnique({
          where: {
            id: existsClientEmployee.clientId,
          },
        });
        const clientEmployee = { ...existsClientEmployee, client: client };
        return clientEmployee;
      }

      return null;
    } catch (error) {
      throw error;
    } finally {
      this.prisma.$disconnect();
    }
  }

  async GetEmployeesByClientId(clientId: number): Promise<Employee[] | null> {
    try {
      const existsClientEmployee = await this.prisma.clientEmployees.findMany({
        where: {
          clientId,
          isActive: true,
        },
      });

      if (existsClientEmployee) {
        const employeeIds = existsClientEmployee.map(
          (clientEmployee) => clientEmployee.employeeId
        );
        const employees = await this.prisma.employees.findMany({
          where: {
            id: {
              in: employeeIds,
            },
          },
        });
        return employees;
      }

      return null;
    } catch (error) {
      throw error;
    } finally {
      this.prisma.$disconnect();
    }
  }

  async Delete(
    clientId: number,
    employeeId: number,
    userId: number
  ): Promise<ClientEmployee | null> {
    try {
      const existingClientEmployee =
        await this.prisma.clientEmployees.findFirst({
          where: {
            clientId,
            employeeId,
          },
        });
      if (existingClientEmployee) {
        const deleted = await this.prisma.clientEmployees.delete({
          where: {
            id: existingClientEmployee.id,
          },
        });
        return deleted;
      }
      return null;
    } catch (error) {
      throw error;
    } finally {
      this.prisma.$disconnect();
    }
  }
}

export default ClientEmployeeRepository;
