import { Group } from '../entities/group.entity';
import { Either, right } from 'fp-ts/Either';

export class CreateGroupDto {
  constructor(readonly name: string) {}

  static toEntity(dto: CreateGroupDto): Either<Error, Group> {
    return Group.create(dto.name);
  }
}
