export class MysteryException extends Error {
  static idNotFound(id: string): MysteryNotFoundException {
    return MysteryNotFoundException.idNotFound(id);
  }

  static codeNotFound(code: string): MysteryNotFoundException {
    return MysteryNotFoundException.codeNotFound(code);
  }

  static illegalArgument(field: string, data: string) {
    return new MysteryException(
      `Mystery illegal argument [${data}] for filed ${field}.`,
    );
  }
}
export class MysteryNotFoundException extends MysteryException {
  static idNotFound(id: string): MysteryNotFoundException {
    return new MysteryNotFoundException(`Mystery with id [${id}] not found.`);
  }

  static codeNotFound(code: string): MysteryNotFoundException {
    return new MysteryNotFoundException(
      `Mystery with code [${code}] not found.`,
    );
  }
}
