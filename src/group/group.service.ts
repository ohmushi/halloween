import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './entities/group.repository';
import {
  Either,
  flatMap,
  fromOption,
  left,
  map,
  right,
  match,
} from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import { providers_tokens } from '../providers.tokens';
import { Option } from 'fp-ts/Option';
import { Group } from './entities/group.entity';
import { GroupExceptions } from './exceptions/group.exceptions';
import { AnswerToMystery } from './entities/answer-to-mystery';

@Injectable()
export class GroupService {
  constructor(
    @Inject(providers_tokens.GROUP_REPOSITORY)
    private readonly groups: GroupRepository,
    @Inject(providers_tokens.ANSWER_TO_MYSTERY)
    private readonly answerToMystery: AnswerToMystery,
  ) {}

  create(dto: CreateGroupDto): Either<Error, string> {
    return pipe(
      dto,
      CreateGroupDto.toEntity,
      flatMap((group) => this.checkConflictsOnGroupName(group)),
      flatMap((group) => group.withId(this.groups.nextId())),
      flatMap(this.groups.add),
      map(Group.id),
    );
  }

  private checkConflictsOnGroupName(group: Group): Either<Error, Group> {
    return pipe(
      this.groups.alreadyKnowTheName(group.name),
      flatMap((alreadyExists) =>
        alreadyExists
          ? left(GroupExceptions.alreadyExists(group.name))
          : right(group),
      ),
    );
  }

  findAll(): Either<Error, Group[]> {
    return this.groups.all();
  }

  findOne(id: string): Option<Group> {
    return this.groups.byId(id);
  }

  resolve(resolveDto: {
    groupId: string;
    mysteryCode: string;
    answer: string;
  }): Either<Error, boolean> {
    return pipe(
      this.groups.byId(resolveDto.groupId),
      fromOption(() => GroupExceptions.notFound(resolveDto.groupId)),
      flatMap((group) =>
        this.updateAndSaveGroupIfMysteryIsResolved(
          group,
          resolveDto.mysteryCode,
          resolveDto.answer,
        ),
      ),
    );
  }

  private updateAndSaveGroupIfMysteryIsResolved(
    group: Group,
    mysteryCode: string,
    answer: string,
  ): Either<Error, boolean> {
    const resolved = this.answerToMystery.answer({
      answer: answer,
      mysteryCode: mysteryCode,
    });
    return pipe(
      resolved,
      flatMap((isResolved) =>
        isResolved ? this.updateAndSaveGroup(group, mysteryCode) : right(false),
      ),
    );
  }

  private updateAndSaveGroup(
    group: Group,
    mysteryCode: string,
  ): Either<Error, boolean> {
    group.resolved(mysteryCode);
    return pipe(
      this.groups.add(group),
      map(() => true),
    );
  }
}
