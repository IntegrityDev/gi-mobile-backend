export interface EmployeeRequestComment {
    id: number;
    comments: string;
    idRequest: number;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
  }
  