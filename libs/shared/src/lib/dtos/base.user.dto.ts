import { IBaseUser } from '../models/base.user.interface';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseUserDto implements IBaseUser {
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;
  @IsNotEmpty()
  @IsString()
  readonly name!: string;
}
