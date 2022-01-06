import { IsEmail, IsString } from 'class-validator';

export class RequestUserDto {
  @IsEmail()
  @IsString()
  public readonly email: string;

  @IsString()
  public readonly name: string;
}
