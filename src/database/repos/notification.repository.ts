import { PrismaClient } from "@prisma/client";
import { LaborArea, Notification } from "../models";
import PrismaInstance from "../../utils/PrismaInstance";

class NotificationRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(identification: string, title: string, message: string, objectId: number, screen: string): Promise<boolean> {
    try {
      await this.prisma.notifications.create({
        data: {
          identification,
          title,
          message,
          isRead: false,
          objectId,
          screen,
        },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async CreateMany(data: any[]): Promise<boolean> {
    try {
      await this.prisma.notifications.createMany({
        data: data,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async GetTops(identification: string): Promise<Notification[]> {
    try {
      return await this.prisma.notifications.findMany({
        where: {
          identification,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    } catch (error) {
      throw error;
    }
  }

  async GetLast(identification: string): Promise<Notification | null> {
    try {
      return await this.prisma.notifications.findFirst({
        where: {
          identification,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });
    } catch (error) {
      throw error;
    }
  }

  async GetAll(identification: string): Promise<Notification[]> {
    try {
      return await this.prisma.notifications.findMany({
        where: {
          identification,
        },
        orderBy: {
          createdAt: "desc",
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

  async ReadNotification(id: number): Promise<Notification | null> {
    try {
      return await this.prisma.notifications.update({
        where: {
          id,
        },
        data: {
          isRead: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

}

export default NotificationRepository;
