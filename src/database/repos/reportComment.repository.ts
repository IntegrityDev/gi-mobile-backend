import { PrismaClient } from '@prisma/client';
import { ReportComment } from '../models';

class ReportCommentRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(reportComment: ReportComment): Promise<ReportComment> {
        try {
            const userEntry = await this.prisma.reportComments.create({
                data: reportComment
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<ReportComment>, userId: number): Promise<ReportComment | null> {
        try {
            const updated = await this.prisma.reportComments.update({
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

    async GetAll(): Promise<ReportComment[]> {
        try {
            return await this.prisma.reportComments.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<ReportComment | null> {
        try {
            return await this.prisma.reportComments.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<ReportComment | null> {
        try {
            const deleted = await this.prisma.reportComments.delete({
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

export default ReportCommentRepository;
