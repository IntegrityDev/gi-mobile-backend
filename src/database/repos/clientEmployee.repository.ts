import { PrismaClient } from "@prisma/client";
import {
  Client,
  ClientEmployee,
  CreateClient,
  CreateClientEmployee,
  CustomError,
  Employee,
  UpdateClient,
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
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.EMPLOYEE_ALREADY_ASSIGNED,
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

  async Delete(id: number, userId: number): Promise<ClientEmployee | null> {
    try {
      const deleted = await this.prisma.clientEmployees.delete({
        where: {
          id,
        },
      });
      return deleted;
    } catch (error) {
      throw error;
    } finally {
      this.prisma.$disconnect();
    }
  }
}

export default ClientEmployeeRepository;
