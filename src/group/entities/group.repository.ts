import { Either } from 'fp-ts/lib/Either';
import { Group } from './group.entity';
import { Option } from 'fp-ts/Option';
export interface GroupRepository {
  nextId(): string;
  add(group: Group): Either<Error, string>;
  alreadyKnowTheName(name: string): boolean;
  all(): Group[];

  byId(id: string): Option<Group>;
}
