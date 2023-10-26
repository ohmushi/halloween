import { string } from 'fp-ts';

export class GroupExceptions extends Error {
  static notFound(id: string): GroupNotFoundException {
    return new GroupNotFoundException(id);
  }

  static illegalArguments(field: string, data: string) {
    return new IllegalArgumentGroupException(field, data);
  }
}

class GroupNotFoundException extends GroupExceptions {
  constructor(id: string) {
    super(`Group with id [${id}] not found.`);
  }
}
class IllegalArgumentGroupException extends GroupExceptions {
  constructor(field: string, data: string) {
    super(`Cannot build Group with ${field} '${data}'.`);
  }
}
