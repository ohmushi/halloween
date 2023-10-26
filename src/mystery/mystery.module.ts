import { Module, Provider } from '@nestjs/common';
import { MysteryService } from './mystery.service';
import { MysteryController } from './mystery.controller';
import { providers_tokens } from '../providers.tokens';
import { FileMysteryRepository } from './infrastructure/file.mystery.repository';
import { DefaultCodeGenerator } from './infrastructure/code-generator/default.code-generator';

const MysteryRepository: Provider = {
  provide: providers_tokens.MYSTERY_REPOSITORY,
  useValue: new FileMysteryRepository(),
};

const CodeGenerator: Provider = {
  provide: providers_tokens.CODE_GENERATOR,
  useClass: DefaultCodeGenerator,
};

@Module({
  controllers: [MysteryController],
  providers: [MysteryService, MysteryRepository, CodeGenerator],
  exports: [MysteryService],
})
export class MysteryModule {}
