import { Client } from "./client.interface";

export interface ClientRequest {
    id: number;
    identification: string;
    isClosed: boolean;
    requestTypeId?: number | null;
    request: string;
    isDeleted: boolean;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    observations?: string;
    clients?: Client | null;
    clientRequestTypes?: any | null
  }
  
  export interface CreateClientRequest extends Omit<ClientRequest, 'id' | 'createdAt'> {
    
  }

  export interface UpdateClientRequest extends Omit<ClientRequest, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}