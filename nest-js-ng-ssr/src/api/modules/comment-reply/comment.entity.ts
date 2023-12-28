import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { BaseEntity } from '../../core/base.entity';

@Entity('commentReply')
export class CommentReply extends BaseEntity {
  @Column('text')
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies)
  comment: Comment;
}
