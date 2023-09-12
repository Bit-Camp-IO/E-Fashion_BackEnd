import Config from '@/config';
import { UserDB } from '@/database/models/user';
import nodemailer from 'nodemailer';

class EmailServices {
  private transporter: nodemailer.Transporter;
  constructor(private senderName: string, private email: string, pass: string) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: this.email,
        pass: pass,
      },
    });
  }
  private async sendMail(content: Omit<nodemailer.SendMailOptions, 'from'>) {
    await this.transporter.sendMail({
      from: `"${this.senderName}" ${this.email}`,
      ...content,
    });
  }
  async sendOTPEmail(otp: string, user: UserDB): Promise<boolean> {
    try {
      await this.sendMail({
        to: user.email,
        subject: 'OTP Verification',
        html: `<p>Hello ${user.fullName}</p>,<p>Here is the verigication code. Please copy it and verify yor Email.</p><div style="text-align: center; background-color: #e2ebff; font-weight: bold; padding: 20px;">code: ${otp}</div>`,
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default new EmailServices('Mahmoud', Config.EMAIL_SENDER, Config.EMAIL_SENDER_PASSWORD);
