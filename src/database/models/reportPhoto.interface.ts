export interface ReportPhoto {
    id: number;
    createdAt: Date;
    createdBy: number;
    imageUrl: string;
    isDeleted: boolean;
    modifiedAt?: Date | null;
    modifiedBy: number;
    reportId: number;
  }
  