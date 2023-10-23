import { CodeGenerator } from './code-generator';

export class DefaultCodeGenerator implements CodeGenerator {
  generateCodeOfLength(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHKMNPRSTUVWXYZ';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
}
