import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordModule } from './password/password.module';
import { PasswordServices } from './password/password.services';
import { CentralModule } from '@book4-muse/shared';
import { UserAuthService } from '@book4-muse/shared';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './env/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PasswordModule,
    CentralModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordServices, UserAuthService],
  exports: [AuthService],
})
export class AuthModule {}
