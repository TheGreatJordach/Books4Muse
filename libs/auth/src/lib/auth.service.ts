import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, isValidDto, UserAuthService } from '@book4-muse/shared';
import { PasswordServices } from './password/password.services';
import { EUser } from '@book4-muse/shared';
import { LoginUserDto } from '@book4-muse/shared';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './env/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly passwordService: PasswordServices,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async registerUser(
    newRegister: CreateUserDto,
  ): Promise<{ accessToken: string }> {
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: newCreatedUser.id,
        email: newCreatedUser.email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return {
      accessToken,
    };
  }

  async logInUser(logInUser: LoginUserDto) {
    // Retrieve the user
    const persistedUser: EUser | null =
      await this.userAuthService.findUserByEmail(logInUser.email);

    if (!persistedUser) {
      throw new HttpException(
        {
          errorType: 'UserNotFound',
          where: AuthService.name,
          date: new Date().toISOString(),
          success: false,
          message: 'No account matches',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const isValidPassword: boolean = await this.passwordService
      .comparePassword(logInUser.password, persistedUser.password)
      .catch((errors) => {
        // Catch errors in password comparison
        throw new HttpException(
          {
            errorType: 'IssueWithCredential',
            where: AuthService.name,
            date: new Date().toISOString(),
            success: false,
            message: `Unable to verify credential ${errors.message} `,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });

    if (!isValidPassword) {
      throw new HttpException(
        {
          errorType: 'InvalidCredential',
          where: AuthService.name,
          date: new Date().toISOString(),
          success: false,
          message: `Wrong Password or Email `,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return persistedUser;
  }
}

export function handleAuthErrors(error: unknown, location: string) {
  const typeError = error as Error;
  console.error(
    `Authentication Error in ${location}: ${
      error instanceof Error ? error.message : typeError.message
    }`,
  );
  if (error instanceof HttpException) {
    throw new HttpException(
      {
        errorType: 'Unexpected Transaction Error',
        location,
        timestamp: new Date().toISOString(),
        details: typeError ? error.message : 'Unknown error occurred',
      },
      HttpStatus.UNAUTHORIZED,
    );
  } else {
    throw error;
  }
}
