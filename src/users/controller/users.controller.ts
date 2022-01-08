import { Controller, Post, Body, Query, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserLoginDto } from '../dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Redis에 임시 유저 저장 이후 이메일 발송 완료',
    type: CreateUserDto,
  })
  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<string> {
    return this.usersService.create(createUserDto);
  }

  @Post('email-verify')
  public async verifyEmail(
    @Query('signupVerifyToken') signupVerifyToken: string,
  ): Promise<string> {
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('login')
  public async login(@Body() dto: UserLoginDto): Promise<{ token: string }> {
    return this.authService.jwtLogIn(dto);
  }
}
