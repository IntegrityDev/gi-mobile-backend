import { PrismaClient } from '@prisma/client';
import { Employee } from '../models';

class EmployeeRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(employee: Employee): Promise<Employee> {
        try {
            const userEntry = await this.prisma.employees.create({
                data: employee
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<Employee>, userId: number): Promise<Employee | null> {
        try {
            const updated = await this.prisma.employees.update({
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

    async GetAll(): Promise<Employee[]> {
        try {
            return await this.prisma.employees.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<Employee | null> {
        try {
            return await this.prisma.employees.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<Employee | null> {
        try {
            const deleted = await this.prisma.employees.delete({
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

export default EmployeeRepository;
