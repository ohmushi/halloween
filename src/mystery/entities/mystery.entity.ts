import { Either, left, right, tryCatch } from 'fp-ts/lib/Either';
import { MysteryException } from '../exceptions/mystery.exeptions';

export class Mystery {
  private constructor(
    readonly id: string | null,
    readonly code: string | null,
    readonly clue: string,
    readonly response: string,
    readonly resolvedByGroups: string[],
  ) {
    if (clue.trim() == '') {
      throw MysteryException.illegalArgument('clue', clue);
    }
    if (response.trim() == '') {
      throw MysteryException.illegalArgument('response', response);
    }
    if (response.trim() == '') {
      throw MysteryException.illegalArgument('response', response);
    }
    if (resolvedByGroups.some((id) => id.trim() === '')) {
      throw MysteryException.illegalArgument(
        'group ids',
        resolvedByGroups.toString(),
      );
    }
  }
  static create(
    clue: string,
    response: string,
  ): Either<MysteryException, Mystery> {
    return tryCatch(
      () => new Mystery(null, null, clue, response, []),
      (e: MysteryException) => e,
    );
  }

  withId(id: string): Either<MysteryException, Mystery> {
    return tryCatch(
      () =>
        new Mystery(
          id,
          this.code,
          this.clue,
          this.response,
          this.resolvedByGroups,
        ),
      (e: MysteryException) => e,
    );
  }

  withCode(code: string): Either<MysteryException, Mystery> {
    return tryCatch(
      () =>
        new Mystery(
          this.id,
          code,
          this.clue,
          this.response,
          this.resolvedByGroups,
        ),
      (e: MysteryException) => e,
    );
  }

  withResponse(response: string): Either<MysteryException, Mystery> {
    return tryCatch(
      () =>
        new Mystery(
          this.id,
          this.code,
          this.clue,
          response,
          this.resolvedByGroups,
        ),
      (e: MysteryException) => e,
    );
  }

  resolvedBy(groupId: string): Either<MysteryException, Mystery> {
    if (groupId.trim() == '')
      return left(MysteryException.illegalArgument('groupdId', groupId));
    const m = this.clone();
    m.resolvedByGroups.push(groupId);
    return right(m);
  }

  private clone(): Mystery {
    return new Mystery(
      this.id,
      this.code,
      this.clue,
      this.response,
      this.resolvedByGroups,
    );
  }
}
