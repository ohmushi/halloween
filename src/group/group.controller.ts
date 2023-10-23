import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { pipe } from 'fp-ts/lib/function';
import { getOrElse as eitherGetOrElse, map } from 'fp-ts/Either';
import { getOrElse as optionGetOrElse } from 'fp-ts/lib/Option';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): string | never {
    return pipe(
      this.groupService.create(createGroupDto),
      eitherGetOrElse((err) => {
        throw err;
      }),
    );
  }

  @Get()
  findAll() {
    return this.groupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return pipe(
      this.groupService.findOne(id),
      optionGetOrElse(() => {
        throw new NotFoundException(id);
      }),
    );
  }
}
