import { IBaseEntity } from './base-entity.interface';
import { IUser } from './user.interface';
import { IComment } from './comment.interface';

export interface IPost extends IBaseEntity {
  title: string;
  text: string;
  user?: IUser;
  comments?: IComment[];
}
