import { Inject, Injectable } from '@nestjs/common';
import { Either } from 'fp-ts/lib/Either';
import { CreateMysteryDto } from './dto/create-mystery.dto';
import { providers_tokens } from '../providers.tokens';
import { MysteryRepository } from './entities/mystery.repository';
import { pipe } from 'fp-ts/function';
import { flatMap, map } from 'fp-ts/Either';
import { Mystery } from './entities/mystery.entity';
import { Option } from 'fp-ts/Option';
import { CodeGenerator } from './infrastructure/code-generator/code-generator';

@Injectable()
export class MysteryService {
  constructor(
    @Inject(providers_tokens.MYSTERY_REPOSITORY)
    private readonly mysteries: MysteryRepository,
    @Inject(providers_tokens.CODE_GENERATOR)
    private readonly codeGenerator: CodeGenerator,
  ) {}

  create(dto: CreateMysteryDto): Either<Error, Mystery> {
    return pipe(
      dto,
      CreateMysteryDto.toEntity,
      map((m) => this.generateIdAndCode(m)),
      flatMap(this.mysteries.add),
    );
  }

  private generateIdAndCode(mystery: Mystery): Mystery {
    return mystery
      .withId(this.mysteries.nextId())
      .withCode(this.generateCodeOf(3));
  }

  private generateCodeOf(length: number) {
    const uniqueCodeHelper = (code: string) => {
      const isInvalid =
        code?.length !== length || this.mysteries.alreadyKnowTheCode(code);
      return isInvalid
        ? uniqueCodeHelper(this.codeGenerator.generateCodeOfLength(length))
        : code;
    };

    return uniqueCodeHelper('');
  }

  findAll(): Mystery[] {
    return this.mysteries.all();
  }

  findOne(code: string): Option<Mystery> {
    return this.mysteries.byCode(code.toUpperCase());
  }
}
