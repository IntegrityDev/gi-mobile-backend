import { Client } from "./client.interface";
import { Employee } from "./employee.interface";

export interface Visit {
    id: number;
    clientId: number;
    employeeId: number;
    dateVisit: Date;
    timeVisit: Date; //To delete
    details?: string | null; //To delete (?)
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
    client?: Client | null;
    employee?:  Employee | null;
  }

  export interface CreateVisit extends Omit<Visit, 'id' | 'createdAt'> {}

  export interface UpdateVisit extends Omit<Visit, 'id' | 'createdAt' | 'createdBy'> {}
  