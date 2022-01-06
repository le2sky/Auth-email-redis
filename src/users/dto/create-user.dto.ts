import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsEmail()
  @IsString()
  public readonly email: string;

  @IsString()
  public readonly name: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  public readonly password: string;
}
