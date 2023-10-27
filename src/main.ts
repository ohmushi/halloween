import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GroupHttpExceptionFilter } from './group/group.http-exception.filter';
import { MysteryHttpExceptionFilter } from './mystery/mystery.http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(
    new GroupHttpExceptionFilter(),
    new MysteryHttpExceptionFilter(),
  );
  await app.listen(3000);
}
bootstrap();
