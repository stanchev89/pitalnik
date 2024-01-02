import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { BaseController } from '../../core/base.controller';
import { IPost } from '../../interfaces/entity/post.interface';
import { IAllowedQueryFields } from '../../interfaces/allowed-query-fields';
import { CRUD } from '../../enums/crud.enum';
import { BasePath } from '../../enums/base-path.enum';

const allowedWhereQueryFields: (keyof IPost)[] = ['title', 'text', 'id', 'user'];
const allowedRelations = ['user'];

@Controller()
export class PostController extends BaseController<IPost> {
  allowedQueryFields: IAllowedQueryFields<IPost> = {
    where: allowedWhereQueryFields,
    relations: allowedRelations,
    order: allowedWhereQueryFields
  };

  repository = this.postRepository;

  availablePaths = {
    [CRUD.POST]: [BasePath.SLASH, BasePath.ENTITY],
    [CRUD.PUT]: [BasePath.ENTITY],
    [CRUD.GET]: [BasePath.SLASH, BasePath.ENTITY]
  };

  override plugBeforeQuery = {
    [CRUD.POST]: {
      [BasePath.SLASH]: (req) => {
        req.body.user = req.user;
        return Promise.resolve(req);
      },
      [BasePath.ENTITY]: (req) => {
        req.body.user = req.user;
        return Promise.resolve(req);
      }
    }
  };

  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    super();
  }
}
