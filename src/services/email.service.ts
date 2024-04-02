import { LaborAreaRepository } from "../database/repos";
import { FormateData } from "../utils";
import { sendEmail } from "../utils/sendEmail";

interface EmailSender {
  name: string;
  phone: string;
  email: string;
  message: string;
}

class EmailService {
    constructor() {
  }

  async SendEmail({ name, phone, email, message }: EmailSender) {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contacto desde el Sitio Web</title>
        </head>
        <body>
            <h2>Contacto desde el Sitio Web</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Correo Electrónico:</strong> ${email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
        </body>
        </html>
    `;

    return await sendEmail(
      "administrativa@gestionintegralcorp.com",
      "Mensaje Web",
      htmlContent
    );
    } catch (error) {
      throw error;
    }
  }
}

export default EmailService;
