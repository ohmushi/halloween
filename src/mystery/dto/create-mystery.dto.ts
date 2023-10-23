import { Either, right } from 'fp-ts/Either';
import { Mystery } from '../entities/mystery.entity';

export class CreateMysteryDto {
  constructor(readonly clue: string) {}
  static toEntity(dto: CreateMysteryDto): Either<Error, Mystery> {
    return right(Mystery.withoutIdAndCode(dto.clue));
  }
}
