import { Either, left, right } from 'fp-ts/Either';
import { Mystery } from '../entities/mystery.entity';
import { BadRequestException } from '@nestjs/common';

export class CreateMysteryDto {
  constructor(readonly clue: string, readonly solution: string) {}
  static toEntity(dto: CreateMysteryDto): Either<Error, Mystery> {
    if (!dto.clue || !dto.solution) return left(new BadRequestException(dto));
    return Mystery.create(dto.clue, dto.solution);
  }
}
