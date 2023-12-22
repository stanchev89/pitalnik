import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ICreateUser, IUser } from '../interfaces/entity/user.interface';
import { ERROR_CODE } from '../enums/error-code';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(user: Partial<IUser>): Promise<User | null> {
    return this.userRepository.findOneBy(user);
  }

  createOne(payload: ICreateUser): Promise<ICreateUser> {
    const entity = Object.assign(new User(), payload);
    return this.userRepository.save(entity).catch((err) => {
      if (err.message?.startsWith('duplicate key')) {
        throw new HttpException(ERROR_CODE.NOT_ACCEPTABLE, HttpStatus.NOT_ACCEPTABLE);
      }
      throw new HttpException(ERROR_CODE.BAD_REQUEST, HttpStatus.BAD_REQUEST);
    });
  }

  updateOne(payload: Partial<User>): Promise<UpdateResult> {
    return this.userRepository.update({ username: payload.username }, payload);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
