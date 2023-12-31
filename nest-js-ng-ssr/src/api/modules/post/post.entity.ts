import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { BaseEntity } from '../../core/base.entity';

@Entity('post')
export class Post extends BaseEntity {
  @Column('varchar')
  title: string;

  @Column('text')
  text: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
