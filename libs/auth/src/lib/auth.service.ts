import { Injectable } from '@nestjs/common';
import { UserAuthService } from '@book4-muse/shared';
import { PasswordServices } from './password/password.services';

@Injectable()
export class AuthService {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly passwordService: PasswordServices,
  ) {}
}
