import { Inject, Injectable } from '@nestjs/common';
import { IUserAuthService } from '@book4-muse/shared';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserAuthService')
    private readonly userAuthService: IUserAuthService,
  ) {}
}
