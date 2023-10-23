import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { MysteryModule } from './mystery/mystery.module';

@Module({
  imports: [GroupModule, MysteryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
