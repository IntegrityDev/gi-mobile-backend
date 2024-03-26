import { PrismaClient } from '@prisma/client';
import { EmployeeRequest } from '../models';

class EmployeeRequestRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(employee: EmployeeRequest): Promise<EmployeeRequest> {
        try {
            const userEntry = await this.prisma.employeeRequests.create({
                data: employee
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<EmployeeRequest>, userId: number): Promise<EmployeeRequest | null> {
        try {
            const updated = await this.prisma.employeeRequests.update({
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

    async GetAll(): Promise<EmployeeRequest[]> {
        try {
            return await this.prisma.employeeRequests.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<EmployeeRequest | null> {
        try {
            return await this.prisma.employeeRequests.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<EmployeeRequest | null> {
        try {
            const deleted = await this.prisma.employeeRequests.delete({
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

export default EmployeeRequestRepository;
