import { IBaseUser } from '../models/base.user.interface';
import { Expose } from 'class-transformer';

export class SharedUserDto implements IBaseUser {
  @Expose()
  readonly id!: number;
  @Expose()
  readonly email!: string;
  @Expose()
  readonly name!: string;
}
