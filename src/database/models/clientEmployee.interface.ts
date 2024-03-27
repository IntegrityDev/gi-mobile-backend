import { Client } from "./client.interface";
import { Employee } from "./employee.interface";

export interface ClientEmployee {
    id: number;
    clientId: number;
    createdAt: Date;
    createdBy: number;
    employeeId: number;
    isActive: boolean;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    employees?: Employee[] | null;
    client?: Client | null;
}

export interface CreateClientEmployee extends Omit<ClientEmployee, 'id' | 'createdAt' | 'employees'> {}