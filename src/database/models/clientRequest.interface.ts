export interface ClientRequest {
    id: number;
    clientId: number;
    request: string;
    isDeleted: boolean;
    isRead: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
  }
  