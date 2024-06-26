import { Client } from "./client.interface";

export interface Employee {
    id: number;
    identification: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    cellphone: string;
    imageUrl?: string | null;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isActive: boolean;
    isSupervisor?: boolean | null;
    client?: Client | null;
  }
  
  export interface CreateEmployee extends Omit<Employee, 'id' | 'createdAt'> {}

  export interface UpdateEmployee extends Omit<Employee, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}