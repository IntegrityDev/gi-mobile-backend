import { PrismaClient } from "@prisma/client";
import {
  Client,
  CreateUser,
  Employee,
  ListUser,
  User,
  UserEmployee,
  UserProfile,
} from "../models";

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
          isDeleted: true,
        },
      });
      const employee = await this.prisma.employees.findFirst({
        where: {
          identification: user?.identificationId,
        },
      });
      return { ...user, employee } as UserEmployee;
    } catch (error) {
      throw error;
    }
  }

  async GetAllProfilesByUserId(userId: number): Promise<UserProfile[]> {
    try {
      return await this.prisma.userProfiles.findMany({
        where: {
          isDeleted: false,
          userId,
        },
        include: {
          profiles: true
        }
      });
    } catch (error) {
      throw error;
    }
}

  async FindUserByIdentification(
    identificationId: string
  ): Promise<User | null> {
    try {
      let name = "", firstName = "", lastName = "";
      const user = await this.prisma.users.findFirst({
        where: {
          identificationId,
        },
      });

      if (user) {
        const employee = await this.FindEmployeeByIdentification(user.identificationId);
        if (employee) {
          name = `${employee.firstName} ${employee.lastName}`;
          firstName = employee.firstName;
          lastName = employee.lastName;
        } else {
          const client = await this.FindClientByIdentification(user.identificationId);
          if (client) {
            name = client.name;
          }
        }
        return {...user, name, firstName, lastName} as User
      }
      return user;
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
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async FindEmployeeByEmail(email: string): Promise<Employee | null> {
    try {
      return await this.prisma.employees.findFirst({
        where: {
          email,
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async FindClientByEmail(email: string): Promise<Client | null> {
    try {
      return await this.prisma.clients.findFirst({
        where: {
          email,
          isActive: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async FindClientByIdentification(identification: string): Promise<Client | null> {
    try {
      return await this.prisma.clients.findFirst({
        where: {
          identification,
          isActive: true,
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

  async SaveRecoveryCode({
    identification,
    isVerified,
    code,
    email,
    createdAt
  }: {
    identification: string;
    email: string;
    code: string;
    isVerified: boolean;
    createdAt: Date
  }): Promise<any> {
    try {
      const userEntry = await this.prisma.recoveryCodes.create({
        data: { identification, isVerified, code, email, createdAt },
      });

      return userEntry;
    } catch (error) {
      throw error;
    }
  }

  async UpdateRecoveryCode(
    id: number,
    code: string,
    isVerified: boolean = false
  ): Promise<any | null> {
    try {
      const updated = await this.prisma.recoveryCodes.update({
        where: {
          id,
        },
        data: {
          code,
          isVerified,
          createdAt: new Date()
        },
      });
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async GetRecoveryCodeByIdentification(
    identification: string
  ): Promise<any | null> {
    try {
      const recoveryCode = await this.prisma.recoveryCodes.findFirst({
        where: {
          identification,
        },
      });
      return recoveryCode;
    } catch (error) {
      throw error;
    }
  }

  async GetRecoveryCodeByEmailAndCode(
    email: string,
    code: string
  ): Promise<any | null> {
    try {
      const recoveryCode = await this.prisma.recoveryCodes.findFirst({
        where: {
          email,
          code,
          isVerified: false
        },
      });
      return recoveryCode;
    } catch (error) {
      throw error;
    }
  }

  async GetVerifiedByEmailAndCode(
    email: string,
    code: string
  ): Promise<any | null> {
    try {
      const recoveryCode = await this.prisma.recoveryCodes.findFirst({
        where: {
          email,
          code,
          isVerified: true
        },
      });
      return recoveryCode;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
