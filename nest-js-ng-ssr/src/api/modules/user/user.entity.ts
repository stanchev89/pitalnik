import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import configuration from '../../../../config/configuration';
import { Post } from '../post/post.entity';
import { BaseEntity } from '../../core/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @Index()
  @Column('varchar', { unique: true })
  username: string;

  @Column('text')
  password: string;

  @Column('varchar', { nullable: true })
  refreshToken: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  @BeforeUpdate()
  setPassword() {
    return bcrypt
      .hash(this.password, configuration().crypto.salt)
      .then((val) => {
        this.password = val;
      })
      .catch((err) => console.log('HASHING ERROR', err));
  }
}
