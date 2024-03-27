export interface Client {
    id: number;
    identification: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    cellphone: string;
    imageUrl?: string | null;
    createdAt: Date;
    createdBy: number;
    modifiedAt?: Date | null;
    modifiedBy?: number | null;
    isActive: boolean;
  }
  
  export interface CreateClient extends Omit<Client, 'id' | 'createdAt'> {}

  export interface UpdateClient extends Omit<Client, 'id' | 'identification' | 'createdAt' | 'createdBy'> {}