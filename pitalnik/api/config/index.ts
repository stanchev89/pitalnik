import path from 'path'
import {
  IBEConfig,
  IConfig,
  IDatabaseConfig,
  IEnvironmentConfig,
} from '../models/interfaces/config'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const apiDistFolder = resolve(serverDistFolder, '../../../api')

const configPath = path.resolve(apiDistFolder, 'config')
const supportedEnvironments = ['dev', 'prod', 'test']

const environment =
  (process.env['NODE_ENV'] as 'dev' | 'prod' | 'test') || 'dev'
if (!supportedEnvironments.includes(environment)) {
  throw new Error(`Supported environments are: ${supportedEnvironments}`)
}

const selectorByEnvironment = {
  dev: <T>(config: IEnvironmentConfig<T>) => config.development,
  prod: <T>(config: IEnvironmentConfig<T>) => config.production,
  test: <T>(config: IEnvironmentConfig<T>) => config.test,
}

const appConfig = require(
  path.join(configPath, 'be.config')
) as IEnvironmentConfig<IBEConfig>
const dbConfig = require(
  path.join(configPath, 'database.config')
) as IEnvironmentConfig<IDatabaseConfig>

const config: IConfig = {
  be: selectorByEnvironment[environment](appConfig),
  db: selectorByEnvironment[environment](dbConfig),
}

export default config
