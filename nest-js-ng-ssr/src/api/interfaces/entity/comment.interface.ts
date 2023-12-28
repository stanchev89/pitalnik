import { IBaseEntity } from './base-entity.interface';
import { IUser } from './user.interface';

export interface IComment extends IBaseEntity {
  text: string;
  user?: IUser;
}
