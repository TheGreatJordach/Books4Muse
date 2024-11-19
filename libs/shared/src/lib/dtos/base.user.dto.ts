import { IBaseUser } from '../models/base.user.interface';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseUserDto implements IBaseUser {
  @ApiProperty({
    example: 'joel.makaya@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
  @ApiProperty({
    example: 'Makaya',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;
}
