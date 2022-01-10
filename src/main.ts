import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

const NEST_LOGGER = {
  logger: WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('email-demo', {
            prettyPrint: true,
          }),
        ),
      }),
    ],
  }),
};

class Application {
  private corsOriginList: string[];
  private SWAGGER_USER: string;
  private SWAGGER_PASSWORD: string;
  private PORT: string;
  private MODE: string;
  private logger = NEST_LOGGER.logger;

  constructor(private server: NestExpressApplication) {
    this.server = server;
    this.PORT = process.env.PORT || '3000';
    this.corsOriginList = process.env.CORS_ORIGIN_LIST
      ? process.env.CORS_ORIGIN_LIST.split(',').map((origin) => origin.trim())
      : ['*'];
    this.SWAGGER_USER = process.env.SWAGGER_USER || 'admin';
    this.SWAGGER_PASSWORD = process.env.SWAGGER_PASSWORD || '1234';
    this.MODE = process.env.NODE_ENV;
  }

  private setUpBasicAuth() {
    this.server.use(
      ['/docs', 'docs-json'],
      expressBasicAuth({
        challenge: true,
        users: {
          [this.SWAGGER_USER]: this.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  private setUpOpenAPImidleware() {
    SwaggerModule.setup(
      'docs',
      this.server,
      SwaggerModule.createDocument(
        this.server,
        new DocumentBuilder()
          .setTitle('email-demo-openApi')
          .setDescription(
            'Nestjs 이메일 인증 기반 회원가입 서비스 오픈 API 문서입니다.',
          )
          .setVersion('1.0')
          .addTag('email-demo')
          .build(),
      ),
    );
  }

  private async setUpGlobalMiddleware() {
    this.server.enableCors({
      origin: this.corsOriginList,
      credentials: true,
    });
    this.setUpBasicAuth();
    this.setUpOpenAPImidleware();
    this.server.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    this.server.useGlobalFilters(new HttpExceptionFilter());
  }

  async bootstrap() {
    await this.setUpGlobalMiddleware();
    await this.server.listen(this.PORT);
  }

  startLog() {
    this.logger.log(
      `✅ ${this.MODE} 모드로 서버-사이드 어플리케이션이 실행됩니다. `,
    );
    if (this.MODE === 'development') {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(
    AppModule,
    NEST_LOGGER,
  );
  const app = new Application(server);
  await app.bootstrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
