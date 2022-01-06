import { Controller, Post, Body, Get, Param, Query, Put } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { identity } from 'rxjs';
import { RequestUserDto } from '../dto/request-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @get all user
  // todo: 권한 부여
  @Get()
  async getAllUser(): Promise<RequestUserDto[]> {
    return [
      { name: 'leesky', email: 'leesky@naver.com' },
      { name: 'leesky2', email: 'leesky2@google.com' },
    ];
  }

  // @get id user
  // todo: 권한 부여
  @Get(':id')
  async getOneUser(@Param('email') email: string): Promise<RequestUserDto> {
    return {
      name: 'test',
      email: 'test@test.com',
    };
  }

  //create user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.usersService.create(createUserDto);
  }

  @Post('email-verify')
  async verifyEmail(@Query('signupVerifyToken') token: string) {
    return await this.usersService.verifyEmail(token);
  }
}
