import { PrismaClient } from '@prisma/client';
import { Profile } from '../models';
import PrismaInstance from '../../utils/PrismaInstance';

class ProfileRepository {
  private prismaInstance: PrismaInstance;
  private prisma: PrismaClient;

  constructor() {
    this.prismaInstance = PrismaInstance.getInstance();
    this.prisma = this.prismaInstance.prisma;
  }

  async Create(profile: Profile): Promise<Profile> {
    try {
      const userEntry = await this.prisma.profiles.create({
        data: profile,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    dataToUpdate: Partial<Profile>,
    userId: number
  ): Promise<Profile | null> {
    try {
      const updated = await this.prisma.profiles.update({
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

  async GetAll(): Promise<Profile[]> {
    try {
      return await this.prisma.profiles.findMany();
    } catch (error) {
      throw error;
    }
  }

  async GetById(id: number): Promise<Profile | null> {
    try {
      return await this.prisma.profiles.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async Delete(id: number, userId: number): Promise<Profile | null> {
    try {
      const deleted = await this.prisma.profiles.delete({
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

export default ProfileRepository;
