import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@book4-muse/users';
import { PasswordModule } from './password/password.module';

@Module({
  imports: [UsersModule, PasswordModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
