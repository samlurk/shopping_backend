import nodemailer, { type Transporter } from 'nodemailer';

class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_ID, // generated ethereal user
        pass: process.env.MAIL_PASSWORD // generated ethereal password
      }
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to,
      subject,
      text,
      html
    };
    await this.transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} with subject: ${subject}`);
  }
}

export default EmailService;
