import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserLoginDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
