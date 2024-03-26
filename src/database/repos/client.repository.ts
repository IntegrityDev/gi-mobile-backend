import { PrismaClient } from '@prisma/client';
import { Client } from '../models';

class ClientRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(client: Client): Promise<Client> {
        try {
            const userEntry = await this.prisma.clients.create({
                data: client
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<Client>, userId: number): Promise<Client | null> {
        try {
            const updated = await this.prisma.clients.update({
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

    async GetAll(): Promise<Client[]> {
        try {
            return await this.prisma.clients.findMany();
        } catch (error) {
            throw error;
        }
    }

    //TODO: fore create
    async GetEmployeesByClientId(clientId: number): Promise<Client[]> {
        try {
            return await this.prisma.clients.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<Client | null> {
        try {
            return await this.prisma.clients.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<Client | null> {
        try {
            const deleted = await this.prisma.clients.delete({
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

export default ClientRepository;
