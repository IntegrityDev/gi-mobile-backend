import sgMail from '@sendgrid/mail';


export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<any> {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    const msg = {
      to,
      from: "giapp@gestionintegralcorp.co",
      subject,
      html
    };
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error("Error al enviar el correo electrónico:", error);
    throw error;
  }
}
