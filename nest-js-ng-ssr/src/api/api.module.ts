import { Module } from '@nestjs/common';
import { PostModule } from './modules/post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';
import { getApiPath } from './utils/get-api-path';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { dataSourceOptions } from './data-source';
import { CommentModule } from './modules/comment/comment.module';
import { CommentReplyModule } from './modules/comment-reply/comment-reply.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    AuthModule,
    PostModule,
    UserModule,
    CommentModule,
    CommentReplyModule,
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
