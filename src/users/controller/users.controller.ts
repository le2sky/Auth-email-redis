import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  UseInterceptors,
  UnauthorizedException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserLoginDto } from '../dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

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
