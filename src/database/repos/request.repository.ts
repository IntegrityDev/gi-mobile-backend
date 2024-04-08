import { PrismaClient } from '@prisma/client';
import { ClientRequest, CreateEmployeeRequest, EmployeeRequest } from '../models';
import { CreateClientRequest } from '../models/clientRequest.interface';
import PrismaInstance from '../../utils/PrismaInstance';
import requestEmitter from '../../events/request.event';

class RequestRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async CreateEmployeeRequest(
    employee: CreateEmployeeRequest
  ): Promise<EmployeeRequest | null> {
    try {
      const { identification, requestTypeId, observations, isClosed } =
        employee;

      const userEntry = await this.prisma.employeeRequests.create({
        data: <any>{
          observations,
          isClosed,
          employeeRequestTypes: {
            connect: {
              id: requestTypeId,
            },
          },
          employees: {
            connect: {
              identification: identification,
            },
          },
        },
        include: {
          employees: true,
          employeeRequestTypes: true
        },
      });
      if (userEntry) {
        requestEmitter.emit("employee-request-created", userEntry);
      }
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async CreateClientRequest(
    employee: CreateClientRequest
  ): Promise<ClientRequest | null> {
    try {
      const { identification, requestTypeId, request, isClosed, createdBy } =
        employee;

      const userEntry = await this.prisma.clientsRequests.create({
        data: <any>{
          request,
          isClosed,
          createdBy,
          isDeleted: false,
          clientRequestTypes: {
            connect: {
              id: requestTypeId,
            },
          },
          clients: {
            connect: {
              identification: identification,
            },
          },
        },
        include: {
          clients: true,
          clientRequestTypes: true
        },
      });

      if (userEntry) {
        requestEmitter.emit("client-request-created", userEntry);
      }
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<EmployeeRequest>,
    userId: number
  ): Promise<EmployeeRequest | null> {
    try {
      const updated = await this.prisma.employeeRequests.update({
        where: {
          id,
        },
        data: <any>dataToUpdate,
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetAll(): Promise<EmployeeRequest[]> {
    try {
      return await this.prisma.employeeRequests.findMany({
        include: {
          employees: true,
          employeeRequestTypes: true,
        },
        orderBy: {
            createdAt: "desc"
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async GetOwnRequests(identification: string): Promise<EmployeeRequest[]> {
    try {
      return await this.prisma.employeeRequests.findMany({
        where: {
          identification,
        },
        include:{
            employees: true,
            employeeRequestTypes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetClientRequests(identification: string): Promise<ClientRequest[]> {
    try {
      return await this.prisma.clientsRequests.findMany({
        where: {
          identification,
        },
        include:{
          clients: true,
          clientRequestTypes: true
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<EmployeeRequest | null> {
    try {
      return await this.prisma.employeeRequests.findFirst({
        where: {
          id,
        },
        include:{
            employees: true,
            employeeRequestTypes: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<EmployeeRequest | null> {
    try {
      const deleted = await this.prisma.employeeRequests.delete({
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

export default RequestRepository;
