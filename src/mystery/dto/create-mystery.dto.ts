import { Either, right } from 'fp-ts/Either';
import { Mystery } from '../entities/mystery.entity';
import { response } from "express";

export class CreateMysteryDto {
  constructor(readonly clue: string, readonly response: string) {}
  static toEntity(dto: CreateMysteryDto): Either<Error, Mystery> {
    return Mystery.create(dto.clue, dto.response);
  }
}
