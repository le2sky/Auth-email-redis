import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

export class UserLoginDto extends PickType(UserEntity, [
  'email',
  'password',
] as const) {}
