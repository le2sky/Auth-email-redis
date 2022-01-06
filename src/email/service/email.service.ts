import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;
  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: 587,
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendJoinEmail(
    emailAddr: string,
    signupVerifyToken: string,
  ): Promise<string> {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOption: EmailOptions = {
      from: `${this.config.auth.user}@naver.com`,
      to: emailAddr,
      subject: '가입 인증 메일',
      html: `
        가입확인 버튼을 눌러 인증을 완료하세요. <br/>
        <form action="${url}" method="POST">
          <button type="submit" formmethod="POST">인증하기👀</button>
        </form>
      `,
    };
    return await this.send(mailOption);
  }
  private async send(m: EmailOptions) {
    try {
      await this.transporter.sendMail(m);
      return '이메일 발송 완료';
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
