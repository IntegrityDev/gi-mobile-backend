import { Employee } from "./employee.interface";

export interface EmployeeRequest {
    id: number;
    identification: string;
    requestTypeId: number;
    isClosed: boolean;
    observations?: string | null;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    employees?: Employee | null;
    employeeRequestTypes?: any;
  }
  
  export interface CreateEmployeeRequest extends Omit<EmployeeRequest, 'id' | 'createdAt'> {}

  export interface UpdateEmployeeRequest extends Omit<EmployeeRequest, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}