import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiModule } from './api/api.module';
import { SSRModule } from './ssr/ssr.module';

// Nest JS Root Module
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ]),
    ApiModule,
    SSRModule,
    RouterModule.register([
      {
        path: 'api/v1',
        module: ApiModule
      },
      {
        path: '*',
        module: SSRModule
      }
    ])
  ]
})
export class AppModule {}
