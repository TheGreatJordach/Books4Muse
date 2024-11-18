import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, isValidDto, UserAuthService } from '@book4-muse/shared';
import { PasswordServices } from './password/password.services';
import { EUser } from '@book4-muse/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly passwordService: PasswordServices,
  ) {}

  async registerUser(newRegister: CreateUserDto) {
    // Stop the process early if user already exist
    const userExist: EUser | null = await this.userAuthService.findUserByEmail(
      newRegister.email,
    );

    if (userExist) {
      throw new HttpException(
        {
          errorType: 'UserAlreadyExists',
          where: AuthService.name,
          date: new Date().toISOString(),
          success: false,
          message: 'User already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    // Hash the password using the decorated method and get the tuple [error, hashedPassword]
    const [error, hashedPassword] = await this.passwordService.hashPassword(
      newRegister.password,
    );

    if (error) {
      console.error('Error hashing password:', error);
      // Throw appropriate error if hashing fails
      throw new HttpException(
        {
          errorType: 'PasswordHashingError',
          where: AuthService.name,
          date: new Date().toISOString(),
          success: false,
          message: 'Failed to hash the password.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newCreatedUser = await this.userAuthService.createUser({
      ...newRegister,
      password: hashedPassword,
    });

    await isValidDto(EUser, newCreatedUser);

    return newCreatedUser;
  }
}
