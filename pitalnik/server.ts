import { APP_BASE_HREF } from '@angular/common'
import { CommonEngine } from '@angular/ssr'
import express from 'express'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import bootstrap from './src/main.server'
import { connectApi } from './api'
import cookieParser from 'cookie-parser'
import { json } from 'body-parser'
import config from './api/config/index'
import cors from 'cors'
import { REFRESH_TOKEN_HEADER_NAME } from './api/models/constants/custom-headers'

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express()
  const serverDistFolder = dirname(fileURLToPath(import.meta.url))
  const browserDistFolder = resolve(serverDistFolder, '../browser')
  const indexHtml = join(serverDistFolder, 'index.server.html')

  const commonEngine = new CommonEngine()

  server.set('view engine', 'html')
  server.set('views', browserDistFolder)
  server.disable('x-powered-by')
  server.use(cookieParser(config.be.cookieSecret))
  server.use(json())

  const corsConfig = cors({
    origin: config.be.corsUrl,
    credentials: config.be.corsCredentials,
    exposedHeaders: [REFRESH_TOKEN_HEADER_NAME],
  })

  server.use(corsConfig)

  const fieldsToExclude = ['password']

  server.set('json replacer', function (attr: string, value: any) {
    if (fieldsToExclude.indexOf(attr) > -1) {
      return '********'
    }
    return value
  })

  connectApi(server)

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  )

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err))
  })

  return server
}

function run(): void {
  const port = process.env['PORT'] || 4000

  // Start up the Node server
  const server = app()
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

run()
