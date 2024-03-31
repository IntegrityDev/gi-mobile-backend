import { PrismaClient } from '@prisma/client';
import { CreateReport, Report } from '../models';

class ReportRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(report: CreateReport): Promise<Report | null> {
        try {
            const userEntry = await this.prisma.reports.create({
                data: report,
                include: {
                    visits: true,
                    employees: true
                }
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<Report>, userId: number): Promise<Report | null> {
        try {
            const updated = await this.prisma.reports.update({
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

    async GetAll(): Promise<Report[]> {
        try {
            return await this.prisma.reports.findMany({
                include: {
                    laborAreas: true
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<Report | null> {
        try {
            return await this.prisma.reports.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async GetByVisitId(visitId: number): Promise<Report[] | null> {
        try {
            return await this.prisma.reports.findMany({
                where: { 
                    visitId
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<Report | null> {
        try {
            const deleted = await this.prisma.reports.delete({
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

export default ReportRepository;
