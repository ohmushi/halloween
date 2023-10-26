import { GroupRepository } from '../entities/group.repository';
import { Injectable } from '@nestjs/common';
import { Either, right } from 'fp-ts/lib/Either';
import { Group } from '../entities/group.entity';
import { fromNullable, Option } from 'fp-ts/Option';

const db: Map<string, Group> = new Map();

@Injectable()
export class InMemoryGroupRepository implements GroupRepository {
  nextId(): string {
    return (db.size + 1).toString();
  }

  add(group: Group): Either<Error, Group> {
    db.set(group.id, group);
    return right(db.get(group.id));
  }

  all(): Group[] {
    return Array.from(db.values());
  }

  alreadyKnowTheName(name: string): boolean {
    return Array.from(db.values()).some((group) => group.name == name);
  }

  byId(id: string): Option<Group> {
    return fromNullable(db.get(id));
  }
}
