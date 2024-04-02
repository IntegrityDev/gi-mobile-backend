import sgMail from '@sendgrid/mail';
import { SENDGRID_KEY } from '../config';
sgMail.setApiKey("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");

export async function sendEmail(
  destinatario: string,
  asunto: string,
  contenidoHTML: string
): Promise<any> {
  try {
    const msg = {
      to: destinatario, // Change to your recipient
      from: "dev.gestionintegral@gmail.com", // Change to your verified sender
      subject: asunto,
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    const response = await sgMail.send(msg);
    console.log("Correo electrónico enviado:", response);
    return response;
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw error;
  }
}
