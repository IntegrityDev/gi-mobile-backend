import { EventEmitter } from "events";
import { ClientRequest, EmployeeRequest } from "../database/models";
import {
  NotificationRepository,
  UserProfileRepository,
  UserRepository,
} from "../database/repos";
import EmailService from "../services/email.service";
import { EMAIL_TEMPLATES } from "../constants";
import { PushNotification } from "../services";
const requestEmitter = new EventEmitter();

requestEmitter.on(
  "employee-request-created",
  async (employeeRequest: EmployeeRequest) => {
    try {
      if (employeeRequest?.employees) {
        const { firstName, lastName } = employeeRequest.employees;
        const name = `${firstName} ${lastName}`;
        const title = `${name} creó una nueva solicitud`;
        const message = `${name} creó una nueva solicitud de tipo ${employeeRequest?.employeeRequestTypes?.name}`;
        const userRepository = new UserRepository();
        const userProfileRepository = new UserProfileRepository();
        const notificationRepository = new NotificationRepository();
        const adminProfile = await userRepository.GetAdminProfile();
        if (adminProfile) {
          const administrators =
            await userProfileRepository.GetUsersByProfileId(adminProfile.id);
          if (administrators) {
            administrators.forEach(async (administrator) => {
              const user = await userRepository.GetUserById(
                administrator.userId
              );
              if (user) {
                await notificationRepository.Create(
                  user.identificationId,
                  title,
                  message,
                  employeeRequest.id,
                  "AddRequest"
                );
                const employee =
                  await userRepository.FindEmployeeByIdentification(
                    user.identificationId
                  );
                if (employee) {
                  try {
                    const emailService = new EmailService();
                    await emailService.SendEmail({
                      title: EMAIL_TEMPLATES.NEW_REQUEST,
                      subject: title,
                      email: employee.email,
                      message: `<strong style="font-size: 26px;">${name}</strong> <p> Creó una nueva solicitud de: <strong>${employeeRequest?.employeeRequestTypes?.name}</strong>.</p>`,
                    });
                  } catch (error) {
                    console.error("Error sending notification email", error);
                  }
                }
                const identifications = [user.identificationId];

                const expoTokens =
                  await userRepository.GetExpoTokensByIdentifications(
                    identifications
                  );

                if (expoTokens && expoTokens.length > 0) {
                  const _tokens = expoTokens.map(
                    (expoToken: any) => expoToken.expoToken
                  );
                  await PushNotification.sendPushNotifications(
                    _tokens,
                    title,
                    message
                  );
                }
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating notification", error);
    }
  }
);

requestEmitter.on(
  "client-request-created",
  async (clientRequest: ClientRequest) => {
    try {
      if (clientRequest?.clients) {
        const { name } = clientRequest.clients;
        const title = `${name} creó una nueva solicitud`;
        const message = `${name} creó una nueva solicitud de tipo ${clientRequest?.clientRequestTypes?.name}`;
        const userRepository = new UserRepository();
        const userProfileRepository = new UserProfileRepository();
        const notificationRepository = new NotificationRepository();
        const adminProfile = await userRepository.GetAdminProfile();

        if (adminProfile) {
          const administrators =
            await userProfileRepository.GetUsersByProfileId(adminProfile.id);
          if (administrators) {
            administrators.forEach(async (administrator) => {
              const user = await userRepository.GetUserById(
                administrator.userId
              );
              if (user) {
                await notificationRepository.Create(
                  user.identificationId,
                  title,
                  message,
                  clientRequest.id,
                  "AddRequest"
                );
                const employee =
                  await userRepository.FindEmployeeByIdentification(
                    user.identificationId
                  );
                if (employee) {
                  try {
                    const emailService = new EmailService();
                    const senderEmail = await emailService.SendEmail({
                      title: EMAIL_TEMPLATES.NEW_REQUEST,
                      subject: title,
                      email: employee.email,
                      message: `<strong style="font-size: 26px;">${name}</strong> <p> Creó una nueva solicitud de: <strong>${clientRequest?.clientRequestTypes?.name}</strong>.</p>`,
                    });
                  } catch (error) {
                    console.error("Error sending notification email", error);
                  }
                }

                const identifications = [user.identificationId];

                const expoTokens =
                  await userRepository.GetExpoTokensByIdentifications(
                    identifications
                  );

                if (expoTokens && expoTokens.length > 0) {
                  const _tokens = expoTokens.map(
                    (expoToken: any) => expoToken.expoToken
                  );
                  await PushNotification.sendPushNotifications(
                    _tokens,
                    title,
                    message
                  );
                }
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating notification", error);
    }
  }
);

export default requestEmitter;
