import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { PasswordServices } from './password/password.services';
import { CentralModule } from '@book4-muse/shared';
import { UserAuthService } from '@book4-muse/shared';

@Module({
  imports: [PasswordModule, CentralModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordServices, UserAuthService],
  exports: [AuthService],
})
export class AuthModule {}
