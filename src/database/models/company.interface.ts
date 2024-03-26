export interface Company {
    id: number;
    identification: string;
    name: string;
    address: string;
    phone: string | null;
    cellphone: string | null;
    imageUrl: string | null;
    createdAt: Date;
    createdBy: number;
    isActive: boolean;
  }
  