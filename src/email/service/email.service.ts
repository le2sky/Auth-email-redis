import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import emailConfig from 'src/config/emailConfig';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
    private mailerService: MailerService,
  ) {}
  public async sendJoinEmail(
    name: string,
    emailAddr: string,
    signupVerifyToken: string,
  ): Promise<string> {
    const baseUrl = this.config.baseUrl;
    const imgUrl = this.config.imgUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    try {
      await this.mailerService.sendMail({
        to: emailAddr,
        template: 'email-template.hbs',
        context: {
          url,
          name,
          imgUrl,
        },
      });
      return '이메일 전송 완료';
    } catch (error) {
      throw new InternalServerErrorException('메일 전송 에러');
    }
  }
}
