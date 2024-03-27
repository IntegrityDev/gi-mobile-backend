import { PrismaClient } from '@prisma/client';
import { UserProfile } from '../models';

class UserProfileRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(userId: number, profileId: number, createdBy: number): Promise<UserProfile> {
        try {
            const userEntry = await this.prisma.userProfiles.create({
                data: {
                    userId,
                    profileId,
                    createdBy,
                    isDeleted: false
                }
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async GetAllByUserId(userId: number): Promise<UserProfile[]> {
        try {
          return await this.prisma.userProfiles.findMany({
            where: {
              isDeleted: false,
              userId,
            },
          });
        } catch (error) {
          throw error;
        }
    }

    async GetByUserIdAndProfileId(userId: number, profileId: number): Promise<UserProfile | null> {
        try {
          return await this.prisma.userProfiles.findFirst({
            where: {
              isDeleted: false,
              userId,
              profileId
            },
          });
        } catch (error) {
          throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<UserProfile | null> {
        try {
            const deleted = await this.prisma.userProfiles.update({
                where: {
                    id
                }, 
                data:{
                    modifiedAt: new Date(),
                    modifiedBy: userId,
                    isDeleted: true
                } 
            });
            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

export default UserProfileRepository;
