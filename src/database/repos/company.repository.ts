import { PrismaClient } from '@prisma/client';
import { Company } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class CompanyRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(company: Company): Promise<Company> {
    try {
      const userEntry = await this.prisma.company.create({
        data: company,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<Company>,
    userId: number
  ): Promise<Company | null> {
    try {
      const updated = await this.prisma.company.update({
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

  async GetAll(): Promise<Company[]> {
    try {
      return await this.prisma.company.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Company | null> {
    try {
      return await this.prisma.company.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Company | null> {
    try {
      const deleted = await this.prisma.company.delete({
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

export default CompanyRepository;
