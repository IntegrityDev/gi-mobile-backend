import { PrismaClient } from "@prisma/client";
import { CreateEmployee, CustomError, Employee, UpdateEmployee } from "../models";
import { RESPONSE_MESSAGES } from "../../constants";

class EmployeeRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async Create(employee: CreateEmployee): Promise<Employee | CustomError> {
    try {
      let customError: CustomError;
      const existingIdentificationClient =
        await this.prisma.employees.findFirst({
          where: {
            identification: employee.identification,
            isActive: true,
          },
        });

      if (existingIdentificationClient) {
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.IDENTIFICATION_ALREADY_EXISTS.replace(
            "{entity}",
            "colaborador"
          ),
        };
        return customError;
      }

      const existingEmailClient = await this.prisma.employees.findFirst({
        where: {
          email: employee.email,
          isActive: true,
        },
      });

      if (existingEmailClient) {
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTS.replace(
            "{entity}",
            "colaborador"
          ),
        };
        return customError;
      }

      const userEntry = await this.prisma.employees.create({
        data: employee,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<UpdateEmployee>,
    userId: number
  ): Promise<Employee | null> {
    try {
        const updated = await this.prisma.employees.update({
            where: {
              id,
            },
            data: {
                ...dataToUpdate,
                modifiedAt: new Date(),
                modifiedBy: userId
            },
          });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetAll(): Promise<Employee[]> {
    try {
      return await this.prisma.employees.findMany({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Employee | null> {
    try {
      return await this.prisma.employees.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Employee | null> {
    try {
      const deleted = await this.prisma.employees.delete({
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

export default EmployeeRepository;
