import { IBaseEntity } from './base-entity.interface';

export interface IUser extends IBaseEntity {
  username: string;
  refreshToken?: string;
}

export interface ICreateUser extends IUser {
  password: string;
}
