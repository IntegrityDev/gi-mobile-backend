import {
  ValidatePassword,
  GenerateSignature,
  FormateData,
  GenerateSalt,
  GeneratePassword,
  ComparePassword,
} from "../utils";
import { EMAIL_TEMPLATES, RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import { UserProfileRepository, UserRepository } from "../database/repos";
import { Client, CreateUser, Employee, User } from "../database/models";
import EmailService from "./email.service";

interface UserInputs {
  identificationId: string;
  password: string;
  newPassword?: string;
  id?: number;
  email?: string;
  name?: string;
}

class AuthService {
  private repository: UserRepository;
  private userProfileRepo: UserProfileRepository;

  constructor() {
    this.repository = new UserRepository();
    this.userProfileRepo = new UserProfileRepository();
  }

  public async SignIn(userInputs: UserInputs): Promise<any> {
    const { identificationId, password } = userInputs;

    try {
      const existingUser: User | null =
        await this.repository.FindUserByIdentification(identificationId);

      if (existingUser) {
        const isValidPassword: boolean = ComparePassword(
          password,
          existingUser.password
        );

        if (isValidPassword) {
          if (!existingUser.isVerified) {
            return FormateData({
              signed: false,
              message: RESPONSE_MESSAGES.USER_NOT_VERIFIED,
              statusCode: STATUS_CODES.OK,
            });
          } else {
            const { identificationId: identification, id } = existingUser;
            const token: string = await GenerateSignature({
              identification,
              id,
            });
            //Get user profiles
            const userProfiles = await this.userProfileRepo.GetAllByUserId(
              existingUser.id
            );
            // console.log("Profiles User", userProfiles)

            return FormateData({
              signed: true,
              id: existingUser.id,
              token,
              message: null,
              statusCode: STATUS_CODES.OK,
            });
          }
        } else {
          return FormateData({
            signed: false,
            message: RESPONSE_MESSAGES.WRONG_LOGIN,
            statusCode: STATUS_CODES.OK,
            token: null,
            id: null,
          });
        }
      } else {
        return FormateData({
          signed: false,
          message: RESPONSE_MESSAGES.WRONG_LOGIN,
          statusCode: STATUS_CODES.OK,
          token: null,
          id: null,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async SignUp(userInputs: UserInputs): Promise<any> {
    const { identificationId, password } = userInputs;

    try {
      //Verifying if user exists
      let existingUser: User | null =
        await this.repository.FindUserByIdentification(identificationId);

      if (existingUser) {
        return FormateData({
          created: false,
          message: RESPONSE_MESSAGES.USER_EXISTS,
          statusCode: STATUS_CODES.BAD_REQUEST,
        });
      }

      //Verifying if user with identification have employee record
      const employee = await this.repository.FindEmployeeByIdentification(
        identificationId
      );
      if (!employee) {
        return FormateData({
          created: false,
          message: RESPONSE_MESSAGES.USER_NO_HAVE_EMPLOYEE,
          statusCode: STATUS_CODES.BAD_REQUEST,
        });
      }

      let salt: string = await GenerateSalt();
      let userPassword: string = await GeneratePassword(password, salt);
      const newUser: CreateUser = {
        identificationId,
        password: userPassword,
        isVerified: false,
        salt,
        isDeleted: false,
      };
      existingUser = await this.repository.CreateUser(newUser);
      return FormateData({
        created: true,
        user: existingUser.id,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }

  public async ChangePassword(userInputs: UserInputs): Promise<any> {
    const { id, identificationId, password, newPassword } = userInputs;
    try {
      const existingUser: User | null =
        await this.repository.FindUserByIdentification(identificationId);
      if (existingUser) {
        if (!existingUser.isVerified) {
          return FormateData({
            signed: false,
            message: RESPONSE_MESSAGES.USER_NOT_VERIFIED,
            statusCode: STATUS_CODES.BAD_REQUEST,
          });
        }
        const isValidPassword: boolean = ComparePassword(
          password,
          existingUser.password
        );
        if (isValidPassword) {
          const salt: string = await GenerateSalt();
          const userPassword: string = await GeneratePassword(
            newPassword!,
            salt
          );
          await this.repository.ChangePassword(id!, userPassword, salt, 1);
          return FormateData({
            changed: true,
            message: RESPONSE_MESSAGES.PASSWORD_CHANGED,
            statusCode: STATUS_CODES.OK,
          });
        }
      }

      return FormateData({
        changed: false,
        message: RESPONSE_MESSAGES.PASSWORD_NOT_CHANGE,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    } catch (error) {
      throw error;
    }
  }

  generateCode() {
    const codigo = Math.floor(100000 + Math.random() * 900000);
    return codigo.toString();
  }

  public async ResetPassword(userInputs: UserInputs): Promise<any> {
    const { email } = userInputs;
    let name, identification;
    try {
      const existingEmployee: Employee | null =
        await this.repository.FindEmployeeByEmail(email!);
      let isValidUser = false;
      if (existingEmployee) {
        name = `${existingEmployee.firstName} ${existingEmployee.lastName}`;
        identification = existingEmployee.identification;
        isValidUser = true;
      } else {
        const existingClient: Client | null =
          await this.repository.FindClientByEmail(email!);
        if (existingClient) {
          isValidUser = true;
          name = existingClient.name;
          identification = existingClient.identification;
        }
      }

      if (isValidUser) {
        const emailService = new EmailService();

        const resetCode: string = this.generateCode();
        const senderEmail = await emailService.SendEmail({
          title: EMAIL_TEMPLATES.RECOVERY_PASSWORD,
          name: name!,
          subject: `${resetCode} es el código de recuperación de contraseña`,
          email: email!,
          message: `<strong style="font-size: 26px; letter-spacing: 4px;">${resetCode}</strong> es el código de recuperación de tu cuenta de GIAPP`,
        });

        if (senderEmail) {
          const recoveryCode =
            await this.repository.GetRecoveryCodeByIdentification(
              identification as string
            );

          if (recoveryCode === null) {
            await this.repository.SaveRecoveryCode({
              identification: identification!,
              email: email!,
              code: resetCode,
              isVerified: false,
            });
          } else {
            await this.repository.UpdateRecoveryCode(
              recoveryCode?.id,
              resetCode
            );
          }

          return FormateData({
            emailSent: true,
            message: RESPONSE_MESSAGES.EMAIL_RESET_SENT,
            statusCode: STATUS_CODES.OK,
          });
        } else {
          return FormateData({
            emailSent: false,
            message: RESPONSE_MESSAGES.EMAIL_RESET_FAILED,
            statusCode: STATUS_CODES.OK,
          });
        }
      }
      return FormateData({
        changed: false,
        message: RESPONSE_MESSAGES.PASSWORD_NOT_CHANGE,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
