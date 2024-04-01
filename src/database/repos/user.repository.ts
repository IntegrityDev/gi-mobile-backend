import { PrismaClient } from "@prisma/client";
import { CreateUser, Employee, ListUser, User, UserEmployee } from "../models";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async CreateUser(user: CreateUser): Promise<User> {
    try {
      const userEntry = await this.prisma.users.create({
        data: user,
      });
      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async UpdateUser(
    id: number,
    dataToUpdate: Partial<User>,
    userId: number
  ): Promise<User | null> {
    try {
      dataToUpdate = {
        ...dataToUpdate,
        modifiedAt: new Date(),
        modifiedBy: userId,
      };
      const updated = await this.prisma.users.update({
        where: {
          id,
        },
        data: dataToUpdate,
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async ChangePassword(
    id: number,
    newPassword: string,
    salt: string,
    userId: number
  ): Promise<User | null> {
    try {
      const updated = await this.prisma.users.update({
        where: {
          id,
        },
        data: {
          modifiedAt: new Date(),
          modifiedBy: userId,
          password: newPassword,
          salt,
        },
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetAllUsers(): Promise<ListUser[]> {
    try {
      const usersWithEmployees = await this.prisma.$queryRaw<ListUser[]>`
        SELECT 
            u.id,
            u.identificationId,
            u.isVerified,
            u.createdAt,
            u.modifiedAt,
            u.modifiedBy,
            u.createdBy,
            u.isDeleted,
            e.firstName,
            e.lastName,
            e.email
        FROM 
            users u
        LEFT JOIN
            employees e ON u.identificationId = e.identification
        WHERE 
            u.isDeleted = false
    `;
      return usersWithEmployees;
    } catch (error) {
      throw error;
    }
  }

  async GetUserById(id: number): Promise<UserEmployee | null> {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          id,
          isDeleted: false,
        },
        select: {
            id: true,
            identificationId: true,
            isVerified: true,
            createdAt: true,
            modifiedAt: true,
            modifiedBy: true,
            createdBy: true,
            isDeleted: true
        }
      });
      const employee = await this.prisma.employees.findFirst({
        where: {
          identification: user?.identificationId,
        },
      });
      return {...user, employee} as UserEmployee
    } catch (error) {
      throw error;
    }
  }

  async FindUserByIdentification(
    identificationId: string
  ): Promise<User | null> {
    try {
      return await this.prisma.users.findFirst({
        where: {
          identificationId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async FindEmployeeByIdentification(
    identificationId: string
  ): Promise<Employee | null> {
    try {
      return await this.prisma.employees.findFirst({
        where: {
          identification: identificationId,
          isActive: true
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async DeleteUser(id: number, userId: number): Promise<User | null> {
    try {
      const deleted = await this.prisma.users.update({
        where: {
          id,
        },
        data: {
          modifiedAt: new Date(),
          modifiedBy: userId,
          isDeleted: true,
        },
      });
      return deleted;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
