import { GroupRepository } from '../entities/group.repository';
import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group.entity';
import { fromNullable, Option } from 'fp-ts/Option';
import { Either, right, left } from 'fp-ts/Either';
import * as fse from 'fs-extra';

let db: Map<string, Group> = new Map();
const file_path = 'db/groups.json';
@Injectable()
export class FileGroupRepository implements GroupRepository {
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
  add(group: Group): Either<Error, string> {
    db.set(group.id, group);
    const content = JSON.stringify(Array.from(db.entries()), null, 2);
    try {
      fse.outputFileSync(file_path, content, { flag: 'w' });
      return right(db.get(group.id).id);
    } catch (e) {
      return left(e);
    }
  }

  all(): Group[] {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return Array.from(db.values());
  }

  alreadyKnowTheName(name: string): boolean {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return Array.from(db.values()).some((group) => group.name == name);
  }

  byId(id: string): Option<Group> {
    const content = fse.readFileSync(file_path, 'utf-8');
    db = new Map(JSON.parse(content));
    return fromNullable(db.get(id));
  }
}
