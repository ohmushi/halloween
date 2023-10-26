import { Either, right } from 'fp-ts/Either';
import { Mystery } from '../entities/mystery.entity';

export class CreateMysteryDto {
  constructor(readonly clue: string, readonly solution: string) {}
  static toEntity(dto: CreateMysteryDto): Either<Error, Mystery> {
    return Mystery.create(dto.clue, dto.solution);
  }
}
