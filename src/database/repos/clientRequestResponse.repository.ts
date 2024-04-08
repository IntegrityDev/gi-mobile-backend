import { PrismaClient } from '@prisma/client';
import { ClientRequestResponse } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class ClientRequestResponseRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(
    clientRequestResponse: ClientRequestResponse
  ): Promise<ClientRequestResponse> {
    try {
      const userEntry = await this.prisma.clientRequestResponses.create({
        data: clientRequestResponse,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<ClientRequestResponse>,
    userId: number
  ): Promise<ClientRequestResponse | null> {
    try {
      const updated = await this.prisma.clientRequestResponses.update({
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

  async GetAll(): Promise<ClientRequestResponse[]> {
    try {
      return await this.prisma.clientRequestResponses.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<ClientRequestResponse | null> {
    try {
      return await this.prisma.clientRequestResponses.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(
    id: number,
    userId: number
  ): Promise<ClientRequestResponse | null> {
    try {
      const deleted = await this.prisma.clientRequestResponses.delete({
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

export default ClientRequestResponseRepository;
