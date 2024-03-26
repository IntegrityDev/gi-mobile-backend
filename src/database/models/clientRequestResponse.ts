export interface ClientRequestResponse {
    id: number;
    comments: string;
    requestId: number;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isDeleted: boolean;
  }
  