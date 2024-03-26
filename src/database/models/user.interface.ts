export interface User {
  id: number;
  identificationId: string;
  password: string;
  salt: string;
  isVerified: boolean;
  createdAt: Date;
  modifiedAt?: Date | null;
  modifiedBy?: number | null;
  createdBy?: number | null;
  isDeleted?: boolean | null   
}