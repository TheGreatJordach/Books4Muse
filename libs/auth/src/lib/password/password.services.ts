import { Injectable } from '@nestjs/common';
import { BcryptImplProvider } from './bcrypt.impl.provider';

/**
 * Service class for handling password operations.
 * Utilizes BcryptImplProvider to perform hashing and comparison of passwords.
 *
 * @constructor
 * @param {BcryptImplProvider} bcryptProvider - The provider for bcrypt hashing and comparison.
 *
 * @method hashPassword
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 *
 * @method comparePassword
 * @param {string} password - The plain text password to compare.
 * @param {string} encrypted - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the passwords match.
 */
@Injectable()
export class PasswordServices {
  constructor(private readonly bcryptProvider: BcryptImplProvider) {}

  // Delegate hashing to bcryptProvider, no error handling here
  async hashPassword(password: string): Promise<string> {
    return await this.bcryptProvider.hash(password);
  }

  // Delegate password comparison to bcryptProvider, no error handling here
  async comparePassword(password: string, encrypted: string): Promise<boolean> {
    return await this.bcryptProvider.compare(password, encrypted);
  }
}
