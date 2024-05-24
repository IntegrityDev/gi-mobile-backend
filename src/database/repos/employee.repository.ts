import { PrismaClient } from "@prisma/client";
import { Client, CreateEmployee, CustomError, Employee, UpdateEmployee } from "../models";
import { RESPONSE_MESSAGES } from "../../constants";
import PrismaInstance from "../../utils/PrismaInstance";

class EmployeeRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
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

  async CreateMany(
    employees: CreateEmployee[]
  ): Promise<number> {
    try {
      const userEntry = await this.prisma.employees.createMany({
        data: employees
      });
      return userEntry?.count;
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
          modifiedBy: userId,
        },
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetAll(query: string | null, supervisors = false): Promise<Employee[]> {
    try {
      let whereCondition: any = {
        isActive: true,
        isSupervisor: supervisors,
      };
      if (query !== "null" && query !== "undefined") {
        whereCondition.OR = [
          {
            firstName: {
              contains: query!,
            },
          },
          {
            lastName: {
              contains: query!,
            },
          },
        ];
      }
      return await this.prisma.employees.findMany({
        where: whereCondition,
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAllForAdmin(query: string | null, supervisors = false): Promise<Employee[]> {
    try {
      let whereCondition: any = {
        isSupervisor: supervisors,
      };
      if (query !== "null" && query !== "undefined") {
        whereCondition.OR = [
          {
            firstName: {
              contains: query!,
            },
          },
          {
            lastName: {
              contains: query!,
            },
          },
        ];
      }
      return await this.prisma.employees.findMany({
        where: whereCondition,
      });
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Employee | null> {
    try {
      let client: Client | null = null;
      const employee = await this.prisma.employees.findFirst({
        where: {
          id,
        },
      });
      if (employee) {
        const clientEmployee = await this.prisma.clientEmployees.findFirst({
          where: {
            employeeId: employee.id,
            isActive: true,
          },
        });

        if (clientEmployee) {
          client = await this.prisma.clients.findFirst({
            where: {
              id: clientEmployee.clientId!,
            },
          });
        }
      }

      return { ...employee, client } as Employee;
    } catch (error) {
      throw error;
    }
  }

  async GetSupervisorById(id: number): Promise<Employee | null> {
    try {
      let client: Client | null = null;
      const employee = await this.prisma.employees.findFirst({
        where: {
          id,
        },
      });
      return employee;
    } catch (error) {
      throw error;
    }
  }

  async GetByIdentification(identification: string): Promise<Employee | null> {
    try {
      let client: Client | null = null;
      const employee = await this.prisma.employees.findFirst({
        where: {
          identification,
        },
        
      });

      if (employee) {
        const clientEmployee = await this.prisma.clientEmployees.findFirst({
          where: {
            employeeId: employee.id,
            isActive: true,
          },
        });
        
        if (clientEmployee) {
          client = await this.prisma.clients.findFirst({
            where: {
              id: clientEmployee.clientId,
              isActive: true,
            },
          });
       }
      }

      return { ...employee, client } as Employee;
    } catch (error) {
      throw error;
    }
  }

  async ValidateEmployee(identification: string): Promise<Employee | null> {
    try {
      return await this.prisma.employees.findFirst({
        where: {
          identification,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetByClientIdentification(
    identification: string
  ): Promise<Employee[] | null> {
    try {
      const client = await this.prisma.clients.findFirst({
        where: {
          identification,
        },
      });
      if (client) {
        const clientEmployee = await this.prisma.clientEmployees.findMany({
          where: {
            clientId: client.id,
            isActive: true,
          },
          select: {
            employeeId: true,
          },
        });

        if (clientEmployee) {
          const _ids = clientEmployee.map((register) => register.employeeId);
          return await this.prisma.employees.findMany({
            where: {
              id: {
                in: _ids,
              },
            },
          });
        }
      }
      return [];
    } catch (error) {
      throw error;
    }
  }

  async GetByClientId(clientId: number): Promise<Employee[] | null> {
    try {
      const clientEmployee = await this.prisma.clientEmployees.findMany({
        where: {
          clientId,
          isActive: true,
        },
        select: {
          employeeId: true,
        },
      });

      if (clientEmployee) {
        const _ids = clientEmployee.map((register) => register.employeeId);
        return await this.prisma.employees.findMany({
          where: {
            id: {
              in: _ids,
            },
          },
        });
      }

      return [];
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
