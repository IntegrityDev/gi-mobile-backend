import { PrismaClient } from '@prisma/client';
import { ClientRequest } from '../models';

class ClientRequestRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async Create(clientRequest: ClientRequest): Promise<ClientRequest> {
        try {
            const userEntry = await this.prisma.clientsRequests.create({
                data: clientRequest
            });
            return userEntry;
            
        } catch (error) {
            throw error;
        }
    }

    async Update(id: number, dataToUpdate: Partial<ClientRequest>, userId: number): Promise<ClientRequest | null> {
        try {
            const updated = await this.prisma.clientsRequests.update({
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

    async GetAll(): Promise<ClientRequest[]> {
        try {
            return await this.prisma.clientsRequests.findMany();
        } catch (error) {
            throw error;
        }
    }

    async GetById(id: number): Promise<ClientRequest | null> {
        try {
            return await this.prisma.clientsRequests.findFirst({
                where: { 
                    id
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async Delete(id: number, userId: number): Promise<ClientRequest | null> {
        try {
            const deleted = await this.prisma.clientsRequests.delete({
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

export default ClientRequestRepository;
