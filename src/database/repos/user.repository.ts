import { PrismaClient } from '@prisma/client';
import { User } from '../models';

class UserRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async CreateUser(user: User): Promise<User> {
        try {
            const userEntry = await this.prisma.users.create({
                data: user
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async UpdateUser(id: number, dataToUpdate: Partial<User>, userId: number): Promise<User | null> {
        try {
            dataToUpdate = {
                ...dataToUpdate,
                modifiedAt: new Date(),
                modifiedBy: userId
            };
            const updated = await this.prisma.users.update({
                where: {
                    id
                },
                data: dataToUpdate
            });
            return updated;
        } catch (error) {
            throw error;
        }
    }

    async GetAllUsers(): Promise<User[]> {
        try {
            return await this.prisma.users.findMany({
                where: {
                    isDeleted: false
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async GetUserById(id: number): Promise<User | null> {
        try {
            return await this.prisma.users.findFirst({
                where: { 
                    id,
                    isDeleted: false
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async DeleteUser(id: number, userId: number): Promise<User | null> {
        try {
            const deleted = await this.prisma.users.update({
                where: {
                    id
                },
                data: {
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

export default UserRepository;
