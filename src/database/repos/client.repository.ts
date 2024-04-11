import { PrismaClient } from "@prisma/client";
import { Client, CreateClient, CustomError, UpdateClient } from "../models";
import { RESPONSE_MESSAGES } from "../../constants";
import PrismaInstance from "../../utils/PrismaInstance";

class ClientRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(client: CreateClient): Promise<Client | CustomError> {
    let customError: CustomError;
    try {
      const existingIdentificationClient = await this.prisma.clients.findFirst({
        where: {
          identification: client.identification,
          isActive: true,
        },
      });

      if (existingIdentificationClient) {
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.IDENTIFICATION_ALREADY_EXISTS.replace(
            "{entity}",
            "cliente"
          ),
        };
        return customError;
      }

      const existingEmailClient = await this.prisma.clients.findFirst({
        where: {
          email: client.email,
          isActive: true,
        },
      });

      if (existingEmailClient) {
        customError = {
          created: false,
          message: RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTS.replace(
            "{entity}",
            "cliente"
          ),
        };
        return customError;
      }

      const newClient = await this.prisma.clients.create({
        data: client,
      });
      return newClient;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<UpdateClient>,
    userId: number
  ): Promise<Client | null> {
    try {
      const updated = await this.prisma.clients.update({
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

  async GetAll(query: string): Promise<Client[]> {
    try {
      let whereCondition: any = {
        isActive: true,
      }
      if (query !== "null" && query !== "undefined") {
        whereCondition.OR = [
          {
            name: {
              contains: query?.trim(),
            },
          },
        ];
      }

      return await this.prisma.clients.findMany({
        where: whereCondition,
      });
    } catch (error) {
      throw error;
    }
  }

  //TODO: fore create
  async GetEmployeesByClientId(clientId: number): Promise<Client[]> {
    try {
      return await this.prisma.clients.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Client | null> {
    try {
      return await this.prisma.clients.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetByIdentification(identification: string): Promise<Client | null> {
    try {
      return await this.prisma.clients.findFirst({
        where: {
          identification,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Client | null> {
    try {
      const deleted = await this.prisma.clients.delete({
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

export default ClientRepository;
