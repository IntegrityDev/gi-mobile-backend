import { PrismaClient } from "@prisma/client";
import { Announcement, CreateAnnouncement } from "../models";
import PrismaInstance from "../../utils/PrismaInstance";

class AnnouncementRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(announcement: CreateAnnouncement): Promise<Announcement> {
    try {
        return await this.prisma.announcements.create({
          data: announcement,
        });
    } catch (error) {
        throw error;
    }
  }

  async GetAll(): Promise<Announcement[]> {
    try {
      return await this.prisma.announcements.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Announcement | null> {
    try {
      return await this.prisma.announcements.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Announcement | null> {
    try {
      const deleted = await this.prisma.announcements.delete({
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

export default AnnouncementRepository;
