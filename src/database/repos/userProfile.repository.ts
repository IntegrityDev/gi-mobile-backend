import { PrismaClient } from '@prisma/client';
import { UserProfile } from '../models';

class UserProfileRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(profile: UserProfile): Promise<UserProfile> {
        try {
            const userEntry = await this.prisma.userProfiles.create({
                data: profile
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async GetAllByUserId(identificationId: number): Promise<UserProfile[]> {
        try {
            return await this.prisma.userProfiles.findMany({
                where: {
                    isDeleted: false,
                    identificationId: identificationId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, identificationId: number, profileId: number, userId: number): Promise<UserProfile | null> {
        try {
            const deleted = await this.prisma.userProfiles.update({
                where: {
                    id_identificationId: {
                        id: id,
                        identificationId: identificationId
                    },
                    profileId
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
