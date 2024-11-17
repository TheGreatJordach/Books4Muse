import { IModelUser } from '../models/model.user.interface';
import { CreateUserDto } from '../dtos/create.user.dto';

export interface IUserAuthService {
  createUser(dto: CreateUserDto): Promise<IModelUser>;
  findUserByEmail(email: string): Promise<IModelUser | null>;
}
