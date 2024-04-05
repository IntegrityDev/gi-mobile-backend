export interface ClientRequest {
    id: number;
    identification: string;
    isClosed: boolean;
    requestTypeId: number;
    request: string;
    isDeleted: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
  }
  