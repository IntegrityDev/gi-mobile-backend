import { PrismaClient } from '@prisma/client';
import { CreateVisit, Visit } from '../models';

class VisitRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(visit: CreateVisit): Promise<Visit> {
        try {
            const userEntry = await this.prisma.visits.create({
                data: visit
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<Visit>, userId: number): Promise<Visit | null> {
        try {
            const updated = await this.prisma.visits.update({
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

    async GetAll(): Promise<Visit[]> {
        try {
            return await this.prisma.visits.findMany({
                include: {
                    employees: true,
                    clients: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<Visit | null> {
        try {
            return await this.prisma.visits.findFirst({
                where: { 
                    id
                },
                include: {
                    clients: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<Visit | null> {
        try {
            const deleted = await this.prisma.visits.delete({
                where: {
                    id
                }
            });
            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

export default VisitRepository;
