import nodemailer from "nodemailer";
import { MAIL } from "./const";

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export default async function sendMail({ to, subject, html }: MailOptions): Promise<string | null> {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: MAIL.address,
      pass: MAIL.password,
    },
  });

  const mailOptions = {
    from: MAIL.address,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info.messageId;
  } catch (error) {
    console.error(error);
    return null;
  }
}
