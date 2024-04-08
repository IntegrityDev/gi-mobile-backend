import { PrismaClient } from '@prisma/client';
import { ReportCommentPhoto } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class ReportCommentPhotoRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(
    reportCommentPhoto: ReportCommentPhoto
  ): Promise<ReportCommentPhoto> {
    try {
      const userEntry = await this.prisma.reportCommentPhotos.create({
        data: reportCommentPhoto,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<ReportCommentPhoto>,
    userId: number
  ): Promise<ReportCommentPhoto | null> {
    try {
      const updated = await this.prisma.reportCommentPhotos.update({
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

  async GetAll(): Promise<ReportCommentPhoto[]> {
    try {
      return await this.prisma.reportCommentPhotos.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<ReportCommentPhoto | null> {
    try {
      return await this.prisma.reportCommentPhotos.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<ReportCommentPhoto | null> {
    try {
      const deleted = await this.prisma.reportCommentPhotos.delete({
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

export default ReportCommentPhotoRepository;
