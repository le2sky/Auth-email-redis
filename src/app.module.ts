import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import emailConfig from './config/emailConfig';
import authConfig from './config/authConfig';
import { validationSchema } from './config/validationSchema';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { HealthCheckController } from './health-check/health-check.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    UsersModule,
    RedisModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/config//env/.${process.env.NODE_ENV}.env`,
      load: [emailConfig, authConfig],
      isGlobal: true,
      validationSchema,
    }),
    EmailModule,
    AuthModule,
    HttpModule, //for health check
    TerminusModule,
  ],
  controllers: [AppController, HealthCheckController],
})
export class AppModule {}
