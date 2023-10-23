import { Module } from '@nestjs/common';
import { MysteryService } from './mystery.service';
import { MysteryController } from './mystery.controller';
import { providers_tokens } from '../providers.tokens';
import { FileMysteryRepository } from './infrastructure/file.mystery.repository';
import { DefaultCodeGenerator } from './infrastructure/code-generator/default.code-generator';

@Module({
  controllers: [MysteryController],
  providers: [
    MysteryService,
    {
      provide: providers_tokens.MYSTERY_REPOSITORY,
      useClass: FileMysteryRepository,
    },
    {
      provide: providers_tokens.CODE_GENERATOR,
      useClass: DefaultCodeGenerator,
    },
  ],
})
export class MysteryModule {}
