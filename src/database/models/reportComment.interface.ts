export interface ReportComment {
    id: number;
    comments: string;
    createdAt: Date;
    createdBy: number;
    isDeleted: boolean;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    reportId: number;
  }
  