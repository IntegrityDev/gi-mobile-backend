import {
  ValidatePassword,
  GenerateSignature,
  FormateData,
  GenerateSalt,
  GeneratePassword,
  ComparePassword,
} from "../utils";
import { EMAIL_TEMPLATES, RESPONSE_MESSAGES, STATUS_CODES } from "../constants";
import { UserRepository } from "../database/repos";
import { Client, CreateUser, Employee, User } from "../database/models";
import EmailService from "./email.service";

interface UserInputs {
  identificationId: string;
  identification: string;
  isClient: string;
  password: string;
  newPassword?: string;
  id?: number;
  email?: string;
  name?: string;
  expoToken?: string;
}

class AuthService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async SignIn(userInputs: UserInputs): Promise<any> {
    const { identificationId, password, expoToken } = userInputs;

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
            const {
              identificationId: identification,
              id,
              name,
              firstName,
              lastName,
              imageUrl,
            } = existingUser;

            let isSupervisor = false,
              isAdmin = false,
              isClient = false,
              isSuperAdmin = false,
              isEmployee = false;
            const userProfiles = await this.repository.GetAllProfilesByUserId(
              existingUser.id
            );

            if (userProfiles && userProfiles.length > 0) {
              userProfiles.forEach((profile) => {
                if (profile.profiles?.isSupervisor) {
                  isSupervisor = true;
                }
                if (profile.profiles?.isAdmin) {
                  isAdmin = true;
                }
                if (profile.profiles?.isClient) {
                  isClient = true;
                }
                if (profile.profiles?.isSysAdmin) {
                  isSuperAdmin = true;
                }
              });
            } else {
              isEmployee = true;
            }

            //ExpoToken of user, should be compare with coming expo token, if different then update
            if (existingUser.expoToken !== expoToken) {
              await this.repository.UpdateUser(
                existingUser.id,
                { expoToken: expoToken! },
                existingUser.id
              );
            }

            const token: string = await GenerateSignature({
              identification,
              id,
              name,
              firstName,
              lastName,
              isSupervisor,
              isSuperAdmin,
              isAdmin,
              isClient,
              isEmployee,
            });

            return FormateData({
              signed: true,
              id: existingUser.id,
              identification,
              token,
              message: null,
              name,
              firstName,
              lastName,
              isSupervisor,
              isSuperAdmin,
              isAdmin,
              isClient,
              isEmployee,
              imageUrl,
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
    const { identification, password, isClient } = userInputs;

    try {
      let existingUser: User | null =
        await this.repository.FindUserByIdentification(identification);

      if (existingUser) {
        return FormateData({
          created: false,
          message: RESPONSE_MESSAGES.USER_EXISTS,
          statusCode: STATUS_CODES.OK,
        });
      }

      const userExists: Employee | Client | null = !isClient
        ? await this.repository.FindEmployeeByIdentification(identification)
        : await this.repository.FindClientByIdentification(identification);

      if (!userExists) {
        return FormateData({
          created: false,
          message: !isClient
            ? RESPONSE_MESSAGES.USER_NO_HAVE_EMPLOYEE
            : RESPONSE_MESSAGES.USER_NO_HAVE_CLIENT,
          statusCode: STATUS_CODES.OK,
        });
      }

      if (!userExists.email) {
        return FormateData({
          created: false,
          message: RESPONSE_MESSAGES.USER_NO_HAVE_EMAIL.replace(
            "{IDENTIFICATION_TYPE}",
            `${isClient ? "NIT" : "Número de identificación"}`
          ),
          statusCode: STATUS_CODES.OK,
        });
      }

      let salt: string = await GenerateSalt();
      const activationCode: string = this.generateActivateCode();
      let userPassword: string = await GeneratePassword(password, salt);
      const newUser: CreateUser = {
        identificationId: identification,
        password: userPassword,
        isVerified: false,
        salt,
        isDeleted: false,
        activationCode,
        activationDate: new Date(),
      };
      existingUser = await this.repository.CreateUser(newUser);

      if (existingUser) {
        if (isClient) {
          const clientProfile = await this.repository.GetClientProfile();
          if (clientProfile) {
            await this.repository.CreateUserProfile(
              existingUser.id,
              clientProfile.id,
              0
            );
          }
        }

        const { name, firstName, lastName } = existingUser;
        const emailService = new EmailService();

        try {
          const senderEmail = await emailService.SendEmail({
            title: EMAIL_TEMPLATES.ACTIVATE_ACCOUNT,
            name: isClient ? name! : `${firstName!} ${lastName!}`,
            subject: `Código de activación ${activationCode}`,
            email: userExists.email,
            message: `<strong style="font-size: 26px; letter-spacing: 4px;">${activationCode}</strong> <p>es el código de activación de tu cuenta en GIAPP, este código es válido por 24 horas.</p>`,
          });
        } catch (error) {
          console.log("Error enviado el email", error);
        }

        return FormateData({
          created: true,
          user: existingUser.id,
          statusCode: STATUS_CODES.OK,
        });
      }

      return FormateData({
        created: false,
        message:
          "Se produjo un error al crear el usuario. Por favor, ponte en contacto con el soporte técnico para obtener ayuda.",
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

  generateActivateCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    const codeLength = 6;

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }

    return code;
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
              createdAt: new Date(),
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
        message: RESPONSE_MESSAGES.EMAIL_RESET_FAILED,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }

  public async VerifyCode(email: string, code: string): Promise<any> {
    try {
      const verifyCode = await this.repository.GetRecoveryCodeByEmailAndCode(
        email?.trim(),
        code?.trim()
      );
      if (verifyCode) {
        const _now = Date.now();
        const differenceTime = _now - verifyCode?.createdAt;
        const differenceDays = differenceTime / (1000 * 60 * 60 * 24);

        if (differenceDays < 1) {
          const updateVerify = await this.repository.UpdateRecoveryCode(
            verifyCode?.id,
            code,
            true
          );
          if (updateVerify) {
            return FormateData({
              verifyCode: true,
              message: RESPONSE_MESSAGES.CODE_VERIFIED,
              statusCode: STATUS_CODES.OK,
              identification: verifyCode?.identification,
            });
          } else {
            return FormateData({
              verifyCode: true,
              message: RESPONSE_MESSAGES.CODE_VERIFIED_FAILED,
              statusCode: STATUS_CODES.OK,
            });
          }
        } else {
          return FormateData({
            verifyCode: false,
            expired: true,
            message: RESPONSE_MESSAGES.CODE_VERIFIED_EXPIRED,
            statusCode: STATUS_CODES.OK,
          });
        }
      }
      return FormateData({
        verifyCode: false,
        message: RESPONSE_MESSAGES.CODE_VERIFIED_FAILED,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }

  public async VerifyActivationCode(
    identification: string,
    code: string
  ): Promise<any> {
    try {
      const verifyActivationCode =
        await this.repository.GetActivationCodeByIdentificationAndCode(
          identification?.trim(),
          code?.trim()
        );

      if (verifyActivationCode) {
        if (verifyActivationCode.isVerified) {
          return FormateData({
            verifyActivationCode: false,
            message: RESPONSE_MESSAGES.CODE_VERIFIED_USED,
            statusCode: STATUS_CODES.OK,
          });
        }
        const _now = Date.now();
        const differenceTime = _now - verifyActivationCode?.activationDate;
        const differenceDays = differenceTime / (1000 * 60 * 60 * 24);

        if (differenceDays < 1) {
          const updateVerify = await this.repository.ActivateUser(
            verifyActivationCode?.id
          );
          if (updateVerify) {
            let userExists: Employee | Client | null =
              await this.repository.FindEmployeeByIdentification(
                identification
              );
            let isValidUser = false;
            let isEmployee = false;
            if (userExists) {
              isValidUser = true;
              isEmployee = true;
            } else {
              userExists = await this.repository.FindClientByIdentification(
                identification
              );
              if (userExists) {
                isValidUser = true;
              }
            }
            try {
              let name = "";
              if (isEmployee) {
                const _employee = userExists as Employee;
                name = `${_employee.firstName} ${_employee.lastName}`;
              } else {
                const _client = userExists as Client;
                name = _client.name;
              }

              if (isValidUser) {
                const emailService = new EmailService();
                await emailService.SendEmail({
                  title: EMAIL_TEMPLATES.WELCOME,
                  name: name!,
                  subject: `${name} ${EMAIL_TEMPLATES.WELCOME}`,
                  email: userExists?.email!,
                  message: `Hola <strong>${name}</strong>,
                <p>Te informamos que tu cuenta ha sido activada con éxito en GIAPP. Ahora puedes iniciar sesión sin problemas.</p>`,
                });
              }
            } catch (error) {
              console.log(
                "Error sending notify about changed password: ",
                error
              );
            }
            return FormateData({
              verifyActivationCode: true,
              message: RESPONSE_MESSAGES.CODE_VERIFIED,
              statusCode: STATUS_CODES.OK,
              identification: verifyActivationCode?.identification,
            });
          } else {
            return FormateData({
              verifyActivationCode: true,
              message: RESPONSE_MESSAGES.CODE_VERIFIED_FAILED,
              statusCode: STATUS_CODES.OK,
            });
          }
        } else {
          return FormateData({
            verifyActivationCode: false,
            expired: true,
            message: RESPONSE_MESSAGES.CODE_VERIFIED_EXPIRED,
            statusCode: STATUS_CODES.OK,
          });
        }
      }
      return FormateData({
        verifyActivationCode: false,
        message: RESPONSE_MESSAGES.CODE_VERIFIED_FAILED,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }

  public async ResendActivationCode(identification: string): Promise<any> {
    try {
      const verifyActivationCode =
        await this.repository.GetActivationCodeByIdentification(
          identification?.trim()
        );

      if (verifyActivationCode) {
        if (verifyActivationCode.isVerified) {
          return FormateData({
            resent: false,
            message: RESPONSE_MESSAGES.USER_ALREADY_ACTIVED,
            statusCode: STATUS_CODES.OK,
          });
        }
        const _now = Date.now();
        const activationCode: string = this.generateActivateCode();

        const updateVerifyCodeAndDate =
          await this.repository.SetNewActivationCodeAndDate(
            verifyActivationCode?.id,
            activationCode
          );
        if (updateVerifyCodeAndDate) {
          let userExists: Employee | Client | null =
            await this.repository.FindEmployeeByIdentification(identification);
          let isValidUser = false;
          let isEmployee = false;
          if (userExists) {
            isValidUser = true;
            isEmployee = true;
          } else {
            userExists = await this.repository.FindClientByIdentification(
              identification
            );
            if (userExists) {
              isValidUser = true;
            }
          }
          if (isValidUser) {
            try {
              let name = "";
              if (isEmployee) {
                const _employee = userExists as Employee;
                name = `${_employee.firstName} ${_employee.lastName}`;
              } else {
                const _client = userExists as Client;
                name = _client.name;
              }
              const emailService = new EmailService();
              await emailService.SendEmail({
                title: EMAIL_TEMPLATES.ACTIVATE_ACCOUNT,
                name: name,
                subject: `Código de activación ${activationCode}`,
                email: userExists?.email!,
                message: `<strong style="font-size: 26px; letter-spacing: 4px;">${activationCode}</strong> <p>es el código de activación de tu cuenta en GIAPP, este código es válido por 24 horas.</p>`,
              });
            } catch (error) {
              console.log("Error enviado el email", error);
            }
          }
          return FormateData({
            resent: true,
            message: RESPONSE_MESSAGES.CODE_VERIFIED,
            statusCode: STATUS_CODES.OK,
            identification: verifyActivationCode?.identification,
          });
        }
        return FormateData({
          resent: false,
          message: RESPONSE_MESSAGES.CODE_VERIFIED_FAILED,
          statusCode: STATUS_CODES.OK,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  public async ChangePasswordAfterVerifiedCode(
    identification: string,
    email: string,
    password: string,
    code: string
  ): Promise<any> {
    if (!identification || !email || !password || !code) {
      return FormateData({
        changed: false,
        message: RESPONSE_MESSAGES.SOME_PARAMETERS_MISSING,
        statusCode: STATUS_CODES.OK,
      });
    }
    try {
      const verifyCode = await this.repository.GetVerifiedByEmailAndCode(
        email?.trim(),
        code?.trim()
      );
      if (verifyCode) {
        const _now = Date.now();
        const differenceTime = _now - verifyCode?.createdAt;
        const differenceDays = differenceTime / (1000 * 60 * 60 * 24);
        if (differenceDays < 1) {
          const existingUser: User | null =
            await this.repository.FindUserByIdentification(identification);

          if (existingUser) {
            const salt: string = await GenerateSalt();
            const userPassword: string = await GeneratePassword(
              password!,
              salt
            );
            await this.repository.ChangePassword(
              existingUser.id,
              userPassword,
              salt,
              0
            );
            try {
              const emailService = new EmailService();
              await emailService.SendEmail({
                title: EMAIL_TEMPLATES.PASSWORD_CHANGED,
                name: existingUser.name!,
                subject: EMAIL_TEMPLATES.PASSWORD_CHANGED,
                email: email!,
                message: `Hola <strong>${existingUser.name}</strong>, queremos informarte que recientemente se realizó un cambio en tu contraseña. Si no fuiste tú quien realizó esta operación, por favor comunícate con nuestro equipo de soporte para verificar la información.`,
              });
            } catch (error) {
              console.log(
                "Error sending notify about changed password: ",
                error
              );
            }
            return FormateData({
              changed: true,
              message: RESPONSE_MESSAGES.PASSWORD_CHANGED,
              statusCode: STATUS_CODES.OK,
            });
          } else {
            return FormateData({
              changed: false,
              message: RESPONSE_MESSAGES.PASSWORD_NOT_CHANGE,
              statusCode: STATUS_CODES.OK,
            });
          }
        } else {
          return FormateData({
            changed: false,
            message: RESPONSE_MESSAGES.CODE_VERIFIED_EXPIRED,
            statusCode: STATUS_CODES.OK,
          });
        }
      }
      return FormateData({
        changed: false,
        message: RESPONSE_MESSAGES.PASSWORD_NOT_CHANGE,
        statusCode: STATUS_CODES.OK,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;
