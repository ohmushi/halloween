import { Either, left, right, tryCatch } from 'fp-ts/lib/Either';
import { MysteryException } from '../exceptions/mystery.exeptions';

export class Mystery {
  private constructor(
    readonly id: string | null,
    readonly code: string | null,
    readonly clue: string,
    readonly solution: string,
    readonly resolvedByGroups: string[],
  ) {
    if (clue.trim() == '') {
      throw MysteryException.illegalArgument('clue', clue);
    }
    if (solution.trim() == '') {
      throw MysteryException.illegalArgument('solution', solution);
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
          this.solution,
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
          this.solution,
          this.resolvedByGroups,
        ),
      (e: MysteryException) => e,
    );
  }
}
