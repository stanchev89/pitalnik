import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { BaseController } from '../../core/base.controller';
import { IPost } from '../../interfaces/entity/post.interface';
import { IAllowedQueryFields } from '../../interfaces/allowed-query-fields';
import { CRUD } from '../../enums/crud.enum';
import { BasePath } from '../../enums/base-path.enum';

const allowedWhereQueryFields: (keyof IPost)[] = ['title', 'text', 'id'];

@Controller()
export class PostController extends BaseController<IPost> {
  allowedQueryFields: IAllowedQueryFields<IPost> = {
    where: allowedWhereQueryFields,
    relations: ['comment'],
    order: allowedWhereQueryFields
  };

  repository = this.postRepository;

  availablePaths = { [CRUD.POST]: [BasePath.SLASH, BasePath.ENTITY], [CRUD.GET]: [BasePath.SLASH, BasePath.ENTITY] };
  override plugAfterQuery = {
    [CRUD.GET]: {
      [BasePath.SLASH]: (req, res) => {
        console.log(res.locals);
        return Promise.resolve(res.locals);
      }
    }
  };

  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {
    super();
  }
}
