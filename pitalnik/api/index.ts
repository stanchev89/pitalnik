import { Express } from 'express'
import apiRouter from './api-router'

export function connectApi(app: Express): void {
  app.use('/api/v1', apiRouter)
}
