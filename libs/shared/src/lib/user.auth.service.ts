import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.user.dto';
import { handleTransactionError } from './utils/handle.transaction.error';
import { isValidDto } from './utils/is.valid.dto';
import { EUser } from './entity/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAuthService {
  constructor(private readonly dataSource: DataSource) {}
  async createUser(newUser: CreateUserDto): Promise<EUser> {
    return await this.dataSource.transaction<EUser>(
      async (transactionOperation) => {
        try {
          // Validate input data
          await isValidDto(CreateUserDto, newUser);

          const userRepo: Repository<EUser> =
            transactionOperation.getRepository(EUser);
          const createdUser: EUser = userRepo.create(newUser);
          const savedUser = await userRepo.save(createdUser);

          if (!savedUser) {
            throw new Error(
              'User creation failed: No user returned from the database',
            );
          }
          return savedUser;
        } catch (error) {
          handleTransactionError(error, UserAuthService.name);
        }
      },
    );
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user entity if found, or null if not found.
   */
  async findUserByEmail(email: string): Promise<EUser | null> {
    // For simple read operations like this, we don’t need to use a transaction .
    const userRepo = this.dataSource.getRepository(EUser);
    return await userRepo.findOneBy({ email });
  }
}
