import { AnswerToMystery } from '../entities/answer-to-mystery';
import { Either } from 'fp-ts/Either';
import { MysteryService } from '../../mystery/mystery.service';
import { Injectable } from '@nestjs/common';

interface AnswerMysteryParams {
  mysteryCode: string;
  answer: string;
}

@Injectable()
export class DefaultAnswerToMystery implements AnswerToMystery {
  constructor(private readonly mysteryService: MysteryService) {}

  answer(dto: AnswerMysteryParams): Either<Error, boolean> {
    return this.mysteryService.resolveMystery({
      code: dto.mysteryCode,
      answer: dto.answer,
    });
  }
}
