import { PickType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

export class ResponseUserDto extends PickType(UserEntity, [
  'email',
  'name',
] as const) {}
