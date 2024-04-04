import { Client } from "./client.interface";

export interface Report {
    id: number;
    laborAreaId: number;
    clientId: number;
    news?: string | null;
    report: string;
    employeeId: number;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
    createdBy: number;
    client?: Client | null
  }
  
  export interface CreateReport extends Omit<Report, 'id' | 'createdAt'> {}

  export interface UpdateReport extends Omit<Report, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}