import { Module } from '@nestjs/common';
import { BcryptImplProvider } from './bcrypt.impl.provider';
import { PasswordServices } from './password.services';

@Module({
  imports: [],
  providers: [PasswordServices, BcryptImplProvider],
})
export class PasswordModule {}
