import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModuleApp } from '../config/config-app.module';
import { FilesModule } from '@book4-muse/files';
import { AuthModule } from '@book4-muse/auth';

@Module({
  imports: [ConfigModuleApp, FilesModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
