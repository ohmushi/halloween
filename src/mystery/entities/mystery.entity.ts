export class Mystery {
  private constructor(
    readonly id: string | null,
    readonly code: string | null,
    readonly clue: string,
  ) {}
  static withoutIdAndCode(clue: string) {
    return new Mystery(null, null, clue);
  }

  withId(id: string): Mystery {
    return new Mystery(id, this.code, this.clue);
  }

  withCode(code: string): Mystery {
    return new Mystery(this.id, code, this.clue);
  }
}
