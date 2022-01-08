import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/service/email.service';
import { RedisService } from 'src/redis/service/redis.service';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import * as uuid from 'uuid';
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';
import { IUserInformation } from 'src/interface/user-info.interface';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    private redisService: RedisService,
    private connection: Connection,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<string> {
    const { name, email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (await this.isUserExist(email)) {
      throw new UnprocessableEntityException(
        '해당 이메일로 가입할 수 없습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();

    const userinfo = {
      name,
      email,
      password: hashedPassword,
    };

    //@ saveUserAtRedis:Promise<boolean>
    await this.saveUserAtRedis(signupVerifyToken, userinfo);
    return await this.emailService.sendJoinEmail(
      name,
      email,
      signupVerifyToken,
    );
  }

  public async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.getUserAtRedis(signupVerifyToken);

    if (await this.isUserExist(user.email)) {
      throw new UnprocessableEntityException(
        '해당 이메일로 가입할 수 없습니다.',
      );
    }
    await this.saveUserAtDB(user);
    await this.deleteUserAtRedis(signupVerifyToken);
    return '회원가입이 완료되었습니다.';
  }

  private async saveUserAtDB(userinfo: IUserInformation): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.email = userinfo.email;
      user.name = userinfo.name;
      user.password = userinfo.password;
      await manager.save(user);
    });
  }

  private async getUserAtRedis(
    signupVerifyToken: string,
  ): Promise<IUserInformation> {
    return await this.redisService.getTempUser(signupVerifyToken);
  }

  private async saveUserAtRedis(
    signupVerifyToken: string,
    userinfo: IUserInformation,
  ): Promise<boolean> {
    return await this.redisService.setTempUser(signupVerifyToken, userinfo);
  }

  private async deleteUserAtRedis(signupVerifyToken): Promise<void> {
    await this.redisService.deleteTempUser(signupVerifyToken);
  }

  private async isUserExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    return user !== undefined;
  }
}
