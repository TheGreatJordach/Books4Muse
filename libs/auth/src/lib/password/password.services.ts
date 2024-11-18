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

  /**
   * Hashes the provided data using BcryptImplProvider.
   *
   * @param data - The data to be hashed, can be a string or Buffer.
   * @returns A promise that resolves to the hashed string.
   *
   * BcryptImplProvider uses @HandleErrors decorator that
   * Returns [null, result] if successful, or [error, null] if an error occurs.
   */
  // Delegate hashing to bcryptProvider, no error handling here
  async hashPassword(password: string): Promise<string> {
    return await this.bcryptProvider.hash(password);
  }

  /**
   * Compares a given data string or buffer with an encrypted string to check for a match.
   *
   * @param data - The plain data to compare, can be a string or Buffer.
   * @param encrypted - The encrypted string to compare against.
   * @returns A promise that resolves to a boolean indicating whether the data matches the encrypted string.
   *
   * BcryptImplProvider uses @HandleErrors decorator that
   * Returns [null, result] if successful, or [error, null] if an error occurs.
   */
  // Delegate password comparison to bcryptProvider, no error handling here
  async comparePassword(password: string, encrypted: string): Promise<boolean> {
    return await this.bcryptProvider.compare(password, encrypted);
  }
}
