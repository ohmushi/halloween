import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { FileGroupRepository } from './infrastructure/file.group.repository';
import { providers_tokens } from '../providers.tokens';

@Module({
  controllers: [GroupController],
  providers: [
    GroupService,
    {
      provide: providers_tokens.GROUP_REPOSITORY,
      useClass: FileGroupRepository,
    },
  ],
})
export class GroupModule {}
