import { Module } from '@nestjs/common';
import { UserAuthService } from './user.auth.service';

@Module({
  imports: [],
  providers: [UserAuthService],
  exports: [UserAuthService],
})
export class CentralModule {}
