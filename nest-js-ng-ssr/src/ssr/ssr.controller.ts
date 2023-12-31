import { Controller, Get, Next, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CommonEngine } from '@angular/ssr';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from '../../angular-app/src/main.server';
import { APP_BASE_HREF } from '@angular/common';

@Controller('*')
export class SSRController {
  @Get()
  feSSR(@Req() request: Request, @Res() res: Response, @Next() next: NextFunction): void {
    const commonEngine = new CommonEngine({ enablePerformanceProfiler: true });
    const { protocol, originalUrl, baseUrl, headers } = request;
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  }
}
