import { Inject, Injectable } from '@nestjs/common';
import { Either, fromOption, flatMap } from 'fp-ts/lib/Either';
import { CreateMysteryDto } from './dto/create-mystery.dto';
import { providers_tokens } from '../providers.tokens';
import { MysteryRepository } from './entities/mystery.repository';
import { pipe } from 'fp-ts/function';
import { Mystery } from './entities/mystery.entity';
import { map, Option } from 'fp-ts/Option';
import { CodeGenerator } from './infrastructure/code-generator/code-generator';
import { MysteryException } from './exceptions/mystery.exeptions';

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
      flatMap((m) => this.generateIdAndCode(m)),
      flatMap(this.mysteries.add),
    );
  }

  private generateIdAndCode(
    mystery: Mystery,
  ): Either<MysteryException, Mystery> {
    return pipe(
      mystery.withId(this.mysteries.nextId()),
      flatMap((m) => m.withCode(this.generateCodeOf(3))),
    );
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

  resolveMystery(dto: {
    code: string;
    answer: string;
  }): Either<Error, boolean> {
    return pipe(
      this.mysteries.byCode(dto.code),
      map((m: Mystery) => m.solution === dto.answer),
      fromOption(() => MysteryException.codeNotFound(dto.code)),
    );
  }
}
