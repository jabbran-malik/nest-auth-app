import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: '"Auth App" <no-reply@test.com>', // 🔥 important
      to: email,
      subject: 'Reset Password',
      html: `
        <h2>Reset Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });
  }
}