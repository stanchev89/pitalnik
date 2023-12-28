import { IUser } from './interfaces/entity/user.interface';
import { PAGINATION, QueryClause } from './enums/query-clause.enum';
import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere } from 'typeorm';

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      [QueryClause.RELATIONS]?: FindOptionsRelations<any>;
      [QueryClause.WHERE]?: FindOptionsWhere<any>;
      [QueryClause.ORDER]?: FindOptionsOrder<any>;
      [PAGINATION]: {
        [QueryClause.SKIP]?: number;
        [QueryClause.TAKE]?: number;
      };
    }
  }
}
export default global;
