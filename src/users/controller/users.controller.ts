import {
  Controller,
  Post,
  Body,
  Query,
  UseInterceptors,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserLoginDto } from '../dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('유저 관리')
@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '회원가입 API' })
  @ApiResponse({
    status: 201,
    description:
      'Redis에 임시 유저 저장 이후 리퀘스트에 실은 이메일로 인증메일을 발송합니다.',
  })
  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<string> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '이메일 인증 API' })
  @ApiResponse({
    status: 201,
    description: '이메일 검증 후 DB에 유저를 저장합니다.',
  })
  @Post('email-verify')
  public async verifyEmail(
    @Query('signupVerifyToken') signupVerifyToken: string,
  ): Promise<string> {
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @ApiOperation({ summary: '로그인 API' })
  @ApiResponse({
    status: 200,
    description: '로그인 완료 시 토큰을 발급합니다.',
  })
  @HttpCode(200)
  @Post('login')
  public async login(@Body() dto: UserLoginDto): Promise<{ token: string }> {
    return this.authService.jwtLogIn(dto);
  }
}
