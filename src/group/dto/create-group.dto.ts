import { Group } from '../entities/group.entity';
import { Either, left } from 'fp-ts/Either';
import { BadRequestException } from '@nestjs/common';

export class CreateGroupDto {
  constructor(readonly name: string) {}

  static toEntity(dto: CreateGroupDto): Either<Error, Group> {
    if (!dto.name) return left(new BadRequestException(dto));
    return Group.create(dto.name);
  }
}
