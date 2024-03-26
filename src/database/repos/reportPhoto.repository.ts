import { PrismaClient } from '@prisma/client';
import { ReportPhoto } from '../models';

class ReportPhotoRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(reportPhoto: ReportPhoto): Promise<ReportPhoto> {
        try {
            const userEntry = await this.prisma.reportPhotos.create({
                data: reportPhoto
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

    async GetById(id: number): Promise<ReportPhoto | null> {
        try {
            return await this.prisma.reportPhotos.findFirst({
                where: { 
                    id
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
