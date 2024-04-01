import { PrismaClient } from '@prisma/client';
import { CreateReportPhoto, ReportPhoto } from '../models';

class ReportPhotoRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(reportPhotos: CreateReportPhoto[]): Promise<any> {
        try {
            const userEntry = await this.prisma.reportPhotos.createMany({
                data: reportPhotos
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<ReportPhoto>, userId: number): Promise<ReportPhoto | null> {
        try {
            const updated = await this.prisma.reportPhotos.update({
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

    async GetAll(): Promise<ReportPhoto[]> {
        try {
            return await this.prisma.reportPhotos.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetByReportId(id: number): Promise<ReportPhoto[] | null> {
        try {
            return await this.prisma.reportPhotos.findMany({
                where: { 
                    reportId: id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async GetLastPhotByReportId(id: number): Promise<ReportPhoto | null> {
        try {
            return await this.prisma.reportPhotos.findFirst({
                where: { 
                    reportId: id
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<ReportPhoto | null> {
        try {
            const deleted = await this.prisma.reportPhotos.delete({
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

export default ReportPhotoRepository;
