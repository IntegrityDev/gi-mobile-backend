export interface EmployeeRequest {
    id: number;
    identification: string;
    requestTypeId: number;
    isClosed: boolean;
    observations?: string | null;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
  }
  
  export interface CreateEmployeeRequest extends Omit<EmployeeRequest, 'id' | 'createdAt'> {}

  export interface UpdateEmployeeRequest extends Omit<EmployeeRequest, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}