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
    observations?: string;
  }
  
  export interface CreateClientRequest extends Omit<ClientRequest, 'id' | 'createdAt'> {
    
  }

  export interface UpdateClientRequest extends Omit<ClientRequest, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}