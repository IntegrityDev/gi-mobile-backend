import { PrismaClient } from "@prisma/client";
import { LaborArea } from "../models";
import PrismaInstance from "../../utils/PrismaInstance";

class LaborAreaRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async GetAll(): Promise<LaborArea[]> {
    try {
      return await this.prisma.laborAreas.findMany({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<LaborArea | null> {
    try {
      return await this.prisma.laborAreas.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<LaborArea | null> {
    try {
      const deleted = await this.prisma.laborAreas.delete({
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

export default LaborAreaRepository;
