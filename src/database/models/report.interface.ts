export interface Report {
    id: number;
    visitId: number;
    laborAreaId: number;
    news?: string | null;
    report: string;
    toEmployeeId?: number | null;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
    createdBy: number;
  }
  
  export interface CreateReport extends Omit<Report, 'id' | 'createdAt'> {}

  export interface UpdateReport extends Omit<Report, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}