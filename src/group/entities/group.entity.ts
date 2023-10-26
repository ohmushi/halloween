import { tryCatch } from 'fp-ts/lib/Either';
import { Either } from 'fp-ts/Either';
import { GroupExceptions } from "../exceptions/group.exceptions";

export class Group {
  private constructor(
    readonly id: string | null,
    readonly name: string,
    readonly mysteriesResolved: string[],
  ) {
    if (name?.trim().length === 0) {
      throw GroupExceptions.illegalArguments('name', name);
    }
  }

  static create(name: string): Either<Error, Group> {
    return tryCatch(
      () => new Group(null, name, []),
      (e) => (e instanceof Error ? e : new Error('unknown error')),
    );
  }
  withId(id: string): Either<Error, Group> {
    return tryCatch(
      () => new Group(id, this.name, this.mysteriesResolved),
      (e) => (e instanceof Error ? e : new Error('unknown error')),
    );
  }

  resolved(mysteryCode: string) {
    this.mysteriesResolved.push(mysteryCode);
  }

  static id(group: Group): string | null {
    return group.id;
  }

  static clone(group: Group): Either<GroupExceptions, Group> {
    return tryCatch(
      () => new Group(group.id, group.name, group.mysteriesResolved),
      (e: GroupExceptions) => e,
    );
  }
}
