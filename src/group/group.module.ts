import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { FileGroupRepository } from './infrastructure/file.group.repository';
import { providers_tokens } from '../providers.tokens';
import { DefaultAnswerToMystery } from './infrastructure/default-answer-to-mystery';
import { MysteryService } from '../mystery/mystery.service';
import { MysteryModule } from "../mystery/mystery.module";

@Module({
  imports: [MysteryModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    {
      provide: providers_tokens.GROUP_REPOSITORY,
      useClass: FileGroupRepository,
    },
    {
      provide: providers_tokens.ANSWER_TO_MYSTERY,
      useClass: DefaultAnswerToMystery,
    },
  ],
})
export class GroupModule {}
