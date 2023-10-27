import { Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupRepository } from './entities/group.repository';
import * as E from 'fp-ts/Either';
import { Either } from 'fp-ts/Either';
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
      E.flatMap((group) => this.checkConflictsOnGroupName(group)),
      E.flatMap((group) => group.withId(this.groups.nextId())),
      E.flatMap(this.groups.add),
      E.map(Group.id),
    );
  }

  private checkConflictsOnGroupName(group: Group): Either<Error, Group> {
    return pipe(
      this.groups.alreadyKnowTheName(group.name),
      E.flatMap((alreadyExists) =>
        alreadyExists
          ? E.left(GroupExceptions.alreadyExists(group.name))
          : E.right(group),
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
      E.fromOption(() => GroupExceptions.notFound(resolveDto.groupId)),
      E.flatMap((group) =>
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
      E.flatMap((isResolved) =>
        isResolved
          ? this.updateAndSaveGroup(group, mysteryCode)
          : E.right(false),
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
      E.map(() => true),
    );
  }
}
