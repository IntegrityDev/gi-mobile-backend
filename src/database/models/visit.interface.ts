export interface Visit {
    id: number;
    clientId: number;
    employeeId: number;
    dateVisit: Date;
    timeVisit: Date;
    details?: string | null;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
  }
  