import { Employee } from "./employee.interface";

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
  isDeleted?: boolean | null;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

export interface CreateUser extends Omit<User, 'id' | 'createdAt' | 'createdBy'> {}

export interface ListUser extends Omit<User, 'password' | 'salt' > {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface UserEmployee extends Omit<User, 'password' | 'salt' > {
  employee: Employee
}