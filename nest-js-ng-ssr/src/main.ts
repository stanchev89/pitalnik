import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setViewEngine('html');
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  // const browserDistFolder = join(__dirname, 'dist/angular-app/browser');
  app.setBaseViewsDir(browserDistFolder);
  app.useStaticAssets(browserDistFolder);
  await app.listen(3000);
}
bootstrap();
