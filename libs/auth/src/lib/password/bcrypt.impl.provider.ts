import { Injectable } from '@nestjs/common';
import { IHashProvider } from './hash.interface';
import { ConfigService } from '@nestjs/config';
import { HandleErrors, handleTransactionError } from '@book4-muse/shared';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptImplProvider implements IHashProvider {
  private readonly saltRound: number;

  constructor(private readonly configService: ConfigService) {
    try {
      this.saltRound = parseInt(configService.getOrThrow('SALT_ROUND'));
    } catch (error) {
      handleTransactionError(error, BcryptImplProvider.name);
    }
  }

  /**
   * Compares a given data string or buffer with an encrypted string to check for a match.
   *
   * @param data - The plain data to compare, can be a string or Buffer.
   * @param encrypted - The encrypted string to compare against.
   * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted string.
   *
   * @HandleErrors
   * Returns [null, result] if successful, or [error, null] if an error occurs.
   */
  @HandleErrors
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }

  /**
   * Hashes the provided data using bcrypt with a generated salt.
   *
   * @param data - The data to be hashed, can be a string or Buffer.
   * @returns A promise that resolves to the hashed string.
   *
   * @HandleErrors
   * Returns [null, result] if successful, or [error, null] if an error occurs.
   */
  @HandleErrors
  async hash(data: string | Buffer): Promise<string> {
    const salt = bcrypt.genSaltSync(this.saltRound);
    return await bcrypt.hash(data, salt);
  }
}
