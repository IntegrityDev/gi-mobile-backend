import {
  ValidatePassword,
  GenerateSignature,
  FormateData,
  GenerateSalt,
  GeneratePassword,
  ComparePassword,
} from "../utils";
import { RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import { UserProfileRepository, UserRepository } from "../database/repos";
import { Client, CreateUser, Employee, User } from "../database/models";
import EmailService from "./email.service";

interface UserInputs {
  identificationId: string;
  password: string;
  newPassword?: string;
  id?: number;
  email?: string;
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

  public async ResetPassword(userInputs: UserInputs): Promise<any> {
    const { email } = userInputs;
    try {
      const existingEmployee: Employee | null =
        await this.repository.FindEmployeeByEmail(email!);
        let isValidUser = false;
      if (existingEmployee) {
        isValidUser = true;
        
      } else {
        const existingClient: Client | null =
        await this.repository.FindClientByEmail(email!);
        if (existingClient) {
          isValidUser = true;
        }
      }

      if (isValidUser) {
       const emailService = new EmailService();
     const email = await emailService.SendEmail({
       name: "Oscar Melgarejo",
       phone: "3222",
       email: "oscar.melgarejob@gmail.com",
       message: "Esto es una prueba",
     });
     console.log(email);
        return FormateData({
            changed: true,
            message: RESPONSE_MESSAGES.PASSWORD_CHANGED,
            statusCode: STATUS_CODES.OK,
          });
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
