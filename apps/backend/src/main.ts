import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useStaticAssets(
    join(process.cwd(), 'apps/backend/uploads/pdf'),
    { prefix: '/pdf/' },
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Backend running: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`PDF route:       http://localhost:${port}/pdf/NOMBRE.pdf`);
}

bootstrap();
