import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUserAuthService',
      useExisting: UsersService,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
