import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import { CommentReply } from '../comment-reply/comment.entity';
import { BaseEntity } from '../../core/base.entity';

@Entity('comment')
export class Comment extends BaseEntity {
  @Column('text')
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @OneToMany(() => CommentReply, (reply) => reply.comment)
  replies: CommentReply[];
}
