import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import configuration from '../../../config/configuration';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('varchar', { unique: true })
  username: string;

  @Column('text')
  password: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @Column('varchar', { nullable: true })
  refreshToken: string;

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

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
