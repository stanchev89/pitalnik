import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentReply } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentReply])]
})
export class CommentReplyModule {}
