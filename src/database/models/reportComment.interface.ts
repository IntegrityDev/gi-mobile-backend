import { Employee } from "./employee.interface";

export interface ReportComment {
    id: number;
    comments: string;
    createdAt: Date;
    createdBy: number;
    isDeleted: boolean;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    reportId: number;
    employeeId: string;
  }
  
  export interface CreateReportComment extends Omit<ReportComment, 'id' | 'createdAt'> {}

  // export interface UpdateReport extends Omit<Report, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}