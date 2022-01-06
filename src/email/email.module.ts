import { Module } from '@nestjs/common';
import { EmailService } from './service/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          secure: false,
          port: 587,
          service: configService.get('EMAIL_SERVICE'),
          auth: {
            user: configService.get('EMAIL_AUTH_USER'),
            pass: configService.get('EMAIL_AUTH_PASSWORD'),
          },
        },
        defaults: {
          from: `"이하늘" <${configService.get('EMAIL_AUTH_USER')}@naver.com>`,
          subject: '가입 인증 메일😎',
        },
        template: {
          dir: path.join(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
