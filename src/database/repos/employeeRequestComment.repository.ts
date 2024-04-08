import { PrismaClient } from '@prisma/client';
import { EmployeeRequestComment } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class EmployeeRequestCommentRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(
    employeeRequestComment: EmployeeRequestComment
  ): Promise<EmployeeRequestComment> {
    try {
      const userEntry = await this.prisma.employeeRequestComments.create({
        data: employeeRequestComment,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<EmployeeRequestComment>,
    userId: number
  ): Promise<EmployeeRequestComment | null> {
    try {
      const updated = await this.prisma.employeeRequestComments.update({
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

  async GetAll(): Promise<EmployeeRequestComment[]> {
    try {
      return await this.prisma.employeeRequestComments.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<EmployeeRequestComment | null> {
    try {
      return await this.prisma.employeeRequestComments.findFirst({
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
  ): Promise<EmployeeRequestComment | null> {
    try {
      const deleted = await this.prisma.employeeRequestComments.delete({
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

export default EmployeeRequestCommentRepository;
