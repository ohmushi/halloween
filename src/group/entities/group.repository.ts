import { Either } from 'fp-ts/lib/Either';
import { Group } from './group.entity';
import { Option } from 'fp-ts/Option';
export interface GroupRepository {
  nextId(): string;

  add(group: Group): Either<Error, Group>;
  alreadyKnowTheName(name: string): Either<Error, boolean>;
  all(): Either<Error, Group[]>;

  byId(id: string): Option<Group>;
}
