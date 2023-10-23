import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './entities/group.repository';
import { Either, flatMap, left, map } from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { providers_tokens } from '../providers.tokens';
import { Option } from "fp-ts/Option";
import { Group } from "./entities/group.entity";

@Injectable()
export class GroupService {
  constructor(
    @Inject(providers_tokens.GROUP_REPOSITORY)
    private readonly groups: GroupRepository,
  ) {}

  create(dto: CreateGroupDto): Either<Error, string> {
    if (this.groups.alreadyKnowTheName(dto.name)) {
      return left(Error(`This name "${dto.name}" has already been taken.`));
    }
    return pipe(
      dto,
      CreateGroupDto.toEntity,
      flatMap((group) => group.withId(this.groups.nextId())),
      flatMap(this.groups.add),
    );
  }

  findAll(): Group[] {
    return this.groups.all();
  }

  findOne(id: string): Option<Group> {
    return this.groups.byId(id);
  }
}
