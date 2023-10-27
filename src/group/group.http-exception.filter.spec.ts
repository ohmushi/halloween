import { GroupHttpExceptionFilter } from './group.http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('should be defined', () => {
    expect(new GroupHttpExceptionFilter()).toBeDefined();
  });
});
