import { Inject, Injectable } from '@nestjs/common';
import { Either, fromOption, right } from 'fp-ts/lib/Either';
import { CreateMysteryDto } from './dto/create-mystery.dto';
import { providers_tokens } from '../providers.tokens';
import { MysteryRepository } from './entities/mystery.repository';
import { pipe } from 'fp-ts/function';
import { flatMap, map as eitherMap } from 'fp-ts/Either';
import { Mystery } from './entities/mystery.entity';
import { Option, map } from 'fp-ts/Option';
import { CodeGenerator } from './infrastructure/code-generator/code-generator';
import { MysteryException } from './exceptions/mystery.exeptions';

interface resolveResult {
  mystery: Mystery;
  responseIsCorrect: boolean;
}

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
    groupId: string;
    code: string;
    response: string;
  }): Either<Error, boolean> {
    return pipe(
      this.mysteries.byCode(dto.code),
      map((m: Mystery) => this.mysteryIsResolved(m, dto.response)),
      fromOption(() => MysteryException.codeNotFound(dto.code)),
      flatMap((res: resolveResult) =>
        this.updateMysteryIfIsResolvedByGroup(res, dto.groupId),
      ),
    );
  }

  private mysteryIsResolved(mystery: Mystery, response: string): resolveResult {
    return {
      mystery: mystery,
      responseIsCorrect: mystery.response === response,
    };
  }

  private updateMysteryIfIsResolvedByGroup(
    res: resolveResult,
    groupId: string,
  ): Either<Error, boolean> {
    return pipe(
      right(res),
      flatMap((res: resolveResult) =>
        res.responseIsCorrect
          ? this.resolveAndSave(res.mystery, groupId)
          : right(false),
      ),
    );
  }

  private resolveAndSave(
    mystery: Mystery,
    groupId: string,
  ): Either<Error, boolean> {
    console.log('resolve and save', mystery);
    return pipe(
      mystery.resolvedBy(groupId),
      flatMap((m) => this.mysteries.add(m)),
      flatMap(() => right(true)),
    );
  }
}
