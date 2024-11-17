import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModuleApp } from '../config/config-app.module';

@Module({
  imports: [ConfigModuleApp],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
