import { Either } from 'fp-ts/lib/Either';

export interface AnswerToMystery {
  answer(dto: { mysteryCode: string; answer: string }): Either<Error, boolean>;
}
