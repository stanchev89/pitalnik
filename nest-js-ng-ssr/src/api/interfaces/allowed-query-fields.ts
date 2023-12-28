import { BaseEntity } from '../core/base.entity';

export interface IAllowedQueryFields<T extends BaseEntity> {
  where: (keyof T)[];
  order?: (keyof T)[];
  relations?: string[];
}
