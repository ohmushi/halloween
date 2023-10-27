import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { MysteryService } from './mystery.service';
import { CreateMysteryDto } from './dto/create-mystery.dto';
import { pipe } from 'fp-ts/function';
import { getOrElse as eitherGetOrElse } from 'fp-ts/Either';
import { getOrElse as optionGetOrElse } from 'fp-ts/Option';
import { Mystery } from './entities/mystery.entity';
import { MysteryHttpExceptionFilter } from './mystery.http-exception.filter';
@Controller('mystery')
export class MysteryController {
  constructor(private readonly mysteryService: MysteryService) {}

  @Post()
  create(@Body() createMysteryDto: CreateMysteryDto): string | never {
    return pipe(
      this.mysteryService.create(createMysteryDto),
      eitherGetOrElse((err) => {
        throw err;
      }),
    );
  }

  @Get()
  findAll() {
    return this.mysteryService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string): Mystery {
    return pipe(
      this.mysteryService.findOne(code),
      optionGetOrElse(() => {
        throw new NotFoundException(code);
      }),
    );
  }
}
