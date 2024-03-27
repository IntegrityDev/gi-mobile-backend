export interface Employee {
    id: number;
    identification: string;
    firstName: string;
    lastName: string;
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
  