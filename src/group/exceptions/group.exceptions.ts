import { string } from 'fp-ts';
export class GroupExceptions extends Error {
  static notFound(id: string): GroupNotFoundException {
    return new GroupNotFoundException(id);
  }

  static illegalArguments(field: string, data: string) {
    return new IllegalArgumentGroupException(field, data);
  }

  static alreadyExists(name: string) {
    return new GroupAlreadyExists(name);
  }
}

export class GroupNotFoundException extends GroupExceptions {
  constructor(id: string) {
    super(`Group with id [${id}] not found.`);
  }
}
export class IllegalArgumentGroupException extends GroupExceptions {
  constructor(field: string, data: string) {
    super(`Cannot build Group with ${field} '${data}'.`);
  }
}

export class GroupAlreadyExists extends GroupExceptions {
  constructor(name: string) {
    super(`This name "${name}" has already been taken.`);
  }
}
