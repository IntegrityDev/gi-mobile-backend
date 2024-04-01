export interface ReportPhoto {
    id: number;
    createdAt: Date;
    createdBy: number;
    imageUrl: string;
    publicId: string;
    url: string;
    secureUrl: string;
    isDeleted: boolean;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    reportId: number;
  }
  
  export interface CreateReportPhoto extends Omit<ReportPhoto, 'id' | 'createdAt'> {}

  export interface UpdateReportPhoto extends Omit<ReportPhoto, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}