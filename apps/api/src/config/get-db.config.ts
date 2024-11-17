import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDbConfig = async (
  ConfigService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: ConfigService.getOrThrow<string>('DATABASE_HOST'),
  port: ConfigService.getOrThrow<number>('DATABASE_PORT'),
  username: ConfigService.getOrThrow<string>('DATABASE_USERNAME'),
  password: ConfigService.getOrThrow<string>('DATABASE_PASSWORD'),
  database: ConfigService.getOrThrow<string>('DATABASE_DATABASE'),
  entities: [],
  synchronize: true,
});
