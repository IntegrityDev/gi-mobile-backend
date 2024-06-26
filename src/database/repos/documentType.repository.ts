import { PrismaClient } from '@prisma/client';
import { DocumentType } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class DocumentTypeRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(documentType: DocumentType): Promise<DocumentType> {
    try {
      const userEntry = await this.prisma.documentTypes.create({
        data: documentType,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<DocumentType>,
    userId: number
  ): Promise<DocumentType | null> {
    try {
      const updated = await this.prisma.documentTypes.update({
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

  async GetAll(): Promise<DocumentType[]> {
    try {
      return await this.prisma.documentTypes.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<DocumentType | null> {
    try {
      return await this.prisma.documentTypes.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<DocumentType | null> {
    try {
      const deleted = await this.prisma.documentTypes.delete({
        where: {
          id,
        },
      });
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  async GetEmployeeRequestTypes(): Promise<any | null> {
    try {
      return await this.prisma.employeeRequestTypes.findMany({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetClientRequestTypes(): Promise<any | null> {
    try {
      return await this.prisma.clientRequestTypes.findMany({
        where: {
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default DocumentTypeRepository;
