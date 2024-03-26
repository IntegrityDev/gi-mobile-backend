export interface EmployeeRequest {
    id: number;
    documentType: number;
    employeeId: number;
    isRead: boolean;
    observations?: string | null;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
  }
  