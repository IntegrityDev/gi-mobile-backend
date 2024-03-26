export interface Report {
    id: number;
    visitId: number;
    report: string;
    createdAt: Date;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
  }
  