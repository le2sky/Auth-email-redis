/*
요구사항
사용자 이름: 2자 이상 30자 이하 문자열
사용자 이메일: 60자 이하 이메일 형식 문자열
사용자 비밀번호: 영문대소문자, 숫자, 특수문자(!@#$%^&*()) 1개 이상 포함 8자 이상 30자 이하 문자열 
+ 연속된 숫자 4개이상 (ex: 1234) 포함 금지
*/

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotContinutyPasswordNumber } from 'src/common/decorators/validation/not-continuity.decorator';
import { NotIn } from 'src/common/decorators/validation/not-in.decorator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @ApiProperty({
    example: 'leesky',
    description: '사용자 이름을 작성합니다',
    required: true,
    maximum: 30,
    minimum: 2,
  })
  public readonly name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsEmail()
  @MaxLength(60)
  @ApiProperty({
    example: 'le2sky@kakao.com',
    description: '60자 이하 이메일 형식 문자열',
    required: true,
    maximum: 60,
  })
  public readonly email: string;

  @Transform(({ value }) => value.trim())
  @NotContinutyPasswordNumber({ message: '연속된 숫자가 포함되었습니다!' })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({
    example: '$qwe125SS',
    description:
      '요구사항: 영문대소문자, 숫자, 특수문자(!@#$%^&*()) 1개 이상 포함 8자 이상 30자 이하 문자열 ',
    required: true,
  })
  public readonly password: string;
}
