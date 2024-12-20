import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDbConfig = async (
  ConfigService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: ConfigService.getOrThrow<string>('DATASOURCE_HOST'),
  port: ConfigService.getOrThrow<number>('DATASOURCE_PORT'),
  username: ConfigService.getOrThrow<string>('DATASOURCE_USERNAME'),
  password: ConfigService.getOrThrow<string>('DATASOURCE_PASSWORD'),
  database: ConfigService.getOrThrow<string>('DATASOURCE_DATABASE'),
  entities: [],
  synchronize: true,
});
