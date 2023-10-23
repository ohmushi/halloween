import { tryCatch } from "fp-ts/lib/Either";
import { Either } from "fp-ts/Either";

export class Group {
  private constructor(readonly id: string | null, readonly name: string) {
    if (name?.trim().length === 0) {
      throw new Error('Invalid Name.');
    }
  }

  static withoutId(name: string): Either<Error, Group> {
    return tryCatch(
      () => new Group(null, name),
      (e) => (e instanceof Error ? e : new Error('unknown error')),
    );
  }
  withId(id: string): Either<Error, Group> {
    return tryCatch(
      () => new Group(id, this.name),
      (e) => (e instanceof Error ? e : new Error('unknown error')),
    );
  }
}
