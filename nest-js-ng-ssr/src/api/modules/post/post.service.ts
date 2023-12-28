import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  findAll(opts?: FindManyOptions<Post>): Promise<Post[]> {
    return this.postRepository.find(opts);
  }

  findOne(opts: FindOneOptions<Post>): Promise<Post> {
    return this.postRepository.findOne(opts);
  }

  createOne(payload: Post): Promise<Post> {
    const entity = Object.assign(new Post(), payload);
    return this.postRepository.save(entity);
  }

  updateOne(payload: Partial<Post>): Promise<UpdateResult> {
    return this.postRepository.update({ id: payload.id }, payload);
  }
}
