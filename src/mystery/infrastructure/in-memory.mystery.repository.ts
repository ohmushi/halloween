import { Inject, Injectable } from '@nestjs/common';
import { Mystery } from '../entities/mystery.entity';
import { MysteryRepository } from '../entities/mystery.repository';
import { Either, right } from 'fp-ts/Either';
import { fromNullable, Option } from 'fp-ts/Option';
import { providers_tokens } from '../../providers.tokens';
import { CodeGenerator } from './code-generator/code-generator';
import { string } from "fp-ts";

const db: Map<string, Mystery> = new Map();

@Injectable()
export class InMemoryMysteryRepository implements MysteryRepository {
  constructor(
    @Inject(providers_tokens.CODE_GENERATOR)
    private readonly codeGenerator: CodeGenerator,
  ) {}

  nextId(): string {
    return (db.size + 1).toString();
  }

  alreadyKnowTheCode(code: string): boolean {
    return Array.from(db.values()).some((m) => m.code === code);
  }

  add(mystery: Mystery): Either<Error, Mystery> {
    db.set(mystery.id, mystery);
    return right(db.get(mystery.id));
  }

  all(): Mystery[] {
    return Array.from(db.values());
  }

  byId(id: string): Option<Mystery> {
    return fromNullable(db.get(id));
  }

  byCode(code: string): Option<Mystery> {
    return fromNullable(Array.from(db.values()).find((m) => m.code === code));
  }
}
