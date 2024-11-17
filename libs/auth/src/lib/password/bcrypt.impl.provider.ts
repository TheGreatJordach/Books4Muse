import { Injectable } from '@nestjs/common';
import { IHashProvider } from './hash.interface';
import { ConfigService } from '@nestjs/config';
import { HandleErrors, handleTransactionError } from '@book4-muse/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptImplProvider implements IHashProvider {
  private readonly saltRound: number;
  private readonly salt: string;
  constructor(private readonly configService: ConfigService) {
    try {
      this.saltRound = configService.getOrThrow<number>('SALT_ROUND');
      this.salt = bcrypt.genSaltSync(this.saltRound);
    } catch (error) {
      handleTransactionError(error, BcryptImplProvider.name);
    }
  }

  @HandleErrors
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }

  @HandleErrors
  async hash(data: string | Buffer): Promise<string> {
    return await bcrypt.hash(data, this.salt);
  }
}
