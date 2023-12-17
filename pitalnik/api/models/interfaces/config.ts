export interface IEnvironmentConfig<T> {
  development: T
  production: T
  test: T
}

export interface IBEConfig {
  appUrl: string
  serverUrl: string
  port: number
  cookieSecret: string
  jwt: {
    secret: string
    issuer: string
  }
  accessTokenExpiryTime: string
  refreshTokenExpiryTime: string
  verificationTokenExpiryTime: string
  dbConnectionString: string
  corsUrl: string
  corsUrlSecure: string
  corsCredentials: boolean
  sequelizeSubQuery: boolean
  https: {
    cert: string
    privKey: string
  }
  sequelizeLogging: boolean
}

export interface IDatabaseConfig {
  database: string
  username: string
  password: string
  host: string
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql'
  port: number
}

export interface IConfig {
  be: IBEConfig
  db: IDatabaseConfig
}
