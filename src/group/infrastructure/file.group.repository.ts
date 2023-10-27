import { GroupRepository } from '../entities/group.repository';
import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group.entity';
import {
  flatMap as OflatMap,
  fromEither,
  fromNullable,
  Option,
} from 'fp-ts/Option';
import {
  Either,
  flatMap,
  left,
  map as mapEither,
  right,
  sequenceArray,
} from 'fp-ts/Either';
import * as fse from 'fs-extra';
import { pipe } from 'fp-ts/lib/function';

type DB = Map<string, Group>;
let db: DB = new Map();
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

  db_from_file(path: string): Either<Error, DB> {
    return this.db_from_string(fse.readFileSync(path, 'utf-8'));
  }

  db_from_string(str: string): Either<Error, DB> {
    db = new Map(JSON.parse(str));
    const groups = sequenceArray(
      Array.from(db.values()).map((g) => Group.clone(g)),
    );
    return pipe(
      groups,
      mapEither((arr) => arr.map(this.transformToKeyValuePair)),
      mapEither((keyValue) => new Map(keyValue)),
    );
  }

  transformToKeyValuePair(a: Group): [string, Group] {
    return [a.id, a];
  }

  nextId(): string {
    return (db.size + 1).toString();
  }

  add(group: Group): Either<Error, Group> {
    db.set(group.id, group);
    const content = JSON.stringify(Array.from(db.entries()), null, 2);
    try {
      fse.outputFileSync(file_path, content, { flag: 'w' });
      return right(db.get(group.id));
    } catch (e) {
      return left(e);
    }
  }

  all(): Either<Error, Group[]> {
    return pipe(
      this.db_from_file(file_path),
      flatMap((fileDb) => {
        db = fileDb;
        return right(Array.from(db.values()));
      }),
    );
  }

  alreadyKnowTheName(name: string): Either<Error, boolean> {
    return pipe(
      this.db_from_file(file_path),
      flatMap((fileDb) => {
        db = fileDb;
        return right(
          Array.from(db.values()).some((group) => group.name == name),
        );
      }),
    );
  }

  byId(id: string): Option<Group> {
    return pipe(
      fromEither(this.db_from_file(file_path)),
      OflatMap((fileDb) => {
        db = fileDb;
        return fromNullable(db.get(id));
      }),
    );
  }
}
