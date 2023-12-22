import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import configuration from '../config/configuration';
import { EXCLUDE_RESPONSE_FIELDS } from './api/constants/exclude-response-fields.const';

// Nest JS bootstrapping
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  app.use(cookieParser(configuration().jwt.secretKey));
  app.setViewEngine('html');
  app.setBaseViewsDir(browserDistFolder);
  app.useStaticAssets(browserDistFolder);

  app.set('json replacer', function (attr: string, value: any) {
    if (EXCLUDE_RESPONSE_FIELDS.includes(attr)) {
      return undefined;
    }
    return value;
  });

  await app.listen(3000);
}

bootstrap();
