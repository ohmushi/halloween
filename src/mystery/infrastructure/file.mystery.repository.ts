import { Inject, Injectable } from '@nestjs/common';
import { Mystery } from '../entities/mystery.entity';
import { MysteryRepository } from '../entities/mystery.repository';
import { Either, left, right } from 'fp-ts/Either';
import { fromNullable, Option } from 'fp-ts/Option';
import { CodeGenerator } from './code-generator/code-generator';
import * as fse from 'fs-extra';
import { DefaultCodeGenerator } from './code-generator/default.code-generator';
import { boolean, string } from 'fp-ts';
import e from 'express';

let db: Map<string, Mystery> = new Map();
const file_path = 'db/mysteries.json';
@Injectable()
export class FileMysteryRepository implements MysteryRepository {
  constructor() {
    try {
      fse.accessSync(file_path, fse.constants.R_OK | fse.constants.W_OK);
      const content = fse.readFileSync(file_path, 'utf-8');
      db = new Map(JSON.parse(content));
    } catch (err) {
      fse.outputFileSync(file_path, '[]');
    }
  }

  nextId(): string {
    return (db.size + 1).toString();
  }

  alreadyKnowTheCode(code: string): boolean {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return Array.from(db.values()).some((m) => m.code === code);
  }

  add(mystery: Mystery): Either<Error, Mystery> {
    db.set(mystery.id, mystery);
    const content = JSON.stringify(Array.from(db.entries()), null, 2);
    try {
      fse.outputFileSync(file_path, content, { flag: 'w' });
      return right(db.get(mystery.id));
    } catch (e) {
      return left(e);
    }
  }

  all(): Mystery[] {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return Array.from(db.values());
  }

  byId(id: string): Option<Mystery> {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return fromNullable(db.get(id));
  }

  byCode(code: string): Option<Mystery> {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return fromNullable(Array.from(db.values()).find((m) => m.code === code));
  }
}
