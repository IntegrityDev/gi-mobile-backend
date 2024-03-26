export interface ReportCommentPhoto {
    id: number;
    createdBy: number;
    imageUrl: string;
    isDeleted: boolean;
    modifiedAt?: number | null;
    modifiedBy?: number | null;
    reportCommentId: number;
  }
  