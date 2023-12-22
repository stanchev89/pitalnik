import { Module } from '@nestjs/common';
import { PostModule } from './modules/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../../config/configuration';
import { RouterModule } from '@nestjs/core';
import { getApiPath } from './utils/get-api-path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

const dbConfig = configuration().database;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: dbConfig.type as 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    PostModule,
    UserModule,
    RouterModule.register([
      {
        path: getApiPath('auth'),
        module: AuthModule
      },
      {
        path: getApiPath('post'),
        module: PostModule
      },
      {
        path: getApiPath('user'),
        module: UserModule
      }
    ])
  ]
})
export class ApiModule {}
