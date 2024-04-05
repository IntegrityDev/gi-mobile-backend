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
  