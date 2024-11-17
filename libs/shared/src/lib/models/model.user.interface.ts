import { IBaseUser } from './base.user.interface';

export interface IModelUser extends IBaseUser {
  id: number;
  name: string;
  email: string;
  password: string;
}
