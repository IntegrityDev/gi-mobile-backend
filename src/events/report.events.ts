import { EventEmitter } from "events";
import { Report, ReportComment } from "../database/models";
import {
  ClientEmployeeRepository,
  ClientRepository,
  EmployeeRepository,
  NotificationRepository,
  ReportRepository,
  UserRepository,
} from "../database/repos";
import EmailService from "../services/email.service";
import { EMAIL_TEMPLATES } from "../constants";
import { PushNotification } from "../services";
const reportEmitter = new EventEmitter();

reportEmitter.on("report-created", async (report: any) => {
  const clientEmployeeRepo = new ClientEmployeeRepository();
  const notificationRepo = new NotificationRepository();
  const userRepo = new UserRepository();
  const employees = await clientEmployeeRepo.GetEmployeesByClientId(
    report.clientId
  );
  if (employees) {
    const { firstName, lastName } = report?.employees;
    const { name } = report?.clients;
    const title = `${firstName} ${lastName} ha creado un nuevo reporte`;
    const message = `${firstName} ${lastName} ha creado un nuevo reporte en ${name}`;
    const notifications = employees.map((employee) => {
      return {
        identification: employee.identification,
        title,
        message,
        isRead: false,
        objectId: report.id,
        screen: "ReportDetails",
      };
    });

    if (notifications) {
      try {
        const saved = await notificationRepo.CreateMany(notifications);
        if (saved) {
          const emailService = new EmailService();
          employees.map(async (employee) => {
            try {
              // await emailService.SendEmail({
              //   title: EMAIL_TEMPLATES.NEW_COMMENT.replace(
              //     "{REPORT_CLIENT}",
              //     name
              //   ),
              //   subject: title,
              //   email: employee?.email!,
              //   message: `<strong style="font-size: 26px;">${firstName} ${lastName}</strong> <p> ha creado un reporte en ${name}:</p>`,
              // });
            } catch (error) {
              console.error("Error sending notification email", error);
            }
          });
        }
      } catch (error) {
        console.log("Error creating notifications: " + error);
      }
    }

    //Get expo tokens by identifications
    const identifications = employees.map(
      ({ identification }) => identification
    );
    
    const expoTokens = await userRepo.GetExpoTokensByIdentifications(
      identifications
    );

    if (expoTokens && expoTokens.length > 0) {
      const _tokens = expoTokens.map((expoToken: any) => expoToken.expoToken) 
      await PushNotification.sendPushNotifications(_tokens, `Nuevo reporte en ${name}`, message);
    }
  }
});

reportEmitter.on("report-commented", async (reportComment: any) => {
  //Send notification to employees related with this report
  const reportRepo = new ReportRepository();
  const clientRepo = new ClientRepository();
  const clientEmployeeRepo = new ClientEmployeeRepository();
  const employeeRepo = new EmployeeRepository();
  const notificationRepo = new NotificationRepository();

  const report = await reportRepo.GetById(reportComment.reportId);
  if (report) {
    //Check if is a author
    const employee = await employeeRepo.GetById(report.employeeId);
    const client = await clientRepo.GetById(report.clientId);
    const { name: clientName } = client!;
    if (report.createdBy === reportComment.createdBy) {
      const employees = await clientEmployeeRepo.GetEmployeesByClientId(
        report.clientId
      );

      if (employees) {
        const { firstName, lastName } = employee!;
        const title = `${firstName} ${lastName} ha comentado en un reporte`;
        const message = `${firstName} ${lastName} ha dejado un comentario en el reporte de ${clientName}`;
        const notifications = employees.map((employee) => {
          return {
            identification: employee.identification,
            title,
            message,
            isRead: false,
            objectId: report.id,
            screen: "ReportDetails",
          };
        });

        if (notifications) {
          const saved = await notificationRepo.CreateMany(notifications);
          if (saved) {
            const emailService = new EmailService();
            employees.map(async (employee) => {
              try {
                await emailService.SendEmail({
                  title: EMAIL_TEMPLATES.NEW_COMMENT.replace(
                    "{REPORT_CLIENT}",
                    clientName
                  ),
                  subject: title,
                  email: employee?.email!,
                  message: `<strong style="font-size: 26px;">${firstName} ${lastName}</strong> <p> ha dejado un comentario en el reporte de ${clientName}:</p><p style="text-align: left;font-style: italic;">${reportComment.comments}</p>`,
                });
              } catch (error) {
                console.error("Error sending notification email", error);
              }
            });
          }
        }
      }
    } else {
      const { firstName, lastName } = reportComment?.employees;
      const title = `${firstName} ${lastName} ha comentado en un reporte`;
      const message = `${firstName} ${lastName} ha dejado un comentario en el reporte de ${clientName}`;
      await notificationRepo.Create(
        employee?.identification!,
        title,
        message,
        report.id,
        "ReportDetails"
      );
      try {
        const emailService = new EmailService();
        const senderEmail = await emailService.SendEmail({
          title: EMAIL_TEMPLATES.NEW_COMMENT.replace(
            "{REPORT_CLIENT}",
            clientName
          ),
          subject: title,
          email: employee?.email!,
          message: `<strong style="font-size: 26px;">${firstName} ${lastName}</strong> <p> ha dejado un comentario en el reporte de ${clientName}:</p><p style="text-align: left;font-style: italic;">${reportComment.comments}</p>`,
        });
      } catch (error) {
        console.error("Error sending notification email", error);
      }
    }
  }
});

export default reportEmitter;
