import {
  Equal,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not
} from 'typeorm';
import { DEFAULT_TAKE, MAX_TAKE } from '../constants/pagination.const';

const QUERY_OPERATORS = {
  not: Not,
  lt: LessThan,
  lte: LessThanOrEqual,
  mt: MoreThan,
  mte: MoreThanOrEqual,
  eq: Equal,
  like: Like,
  iLike: ILike
};

const parseRawWhereValue = (where: string): boolean | number | string => {
  switch (where) {
    case undefined:
      return true;
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return where.startsWith('@') ? Number(where.slice(1)) : where;
  }
};

const convertParamsToObj = (
  query: string,
  allowedFields: string[]
): FindOptionsRelations<any> | FindOptionsWhere<any> => {
  // Example of a query: ?where= "post,comment$text=true$test=false$shorthand$name=Stefan&num=@5,age|mte=@10"
  // Results in: { post: true, comment: { text: true, test: false, shorthand: true }, name: 'Stefan', num: 5, age: MoreThanOrEqual(10)  }
  const conditions = query.split(',');
  return conditions.reduce((acc, cur) => {
    const [parentKey, ...whereArr] = cur.split('$');
    if (allowedFields.length && !allowedFields.includes(parentKey)) {
      return acc;
    }
    // Shorthand
    if (!whereArr.length) {
      acc[parentKey] = true;
      return acc;
    }
    // Parse where conditions
    const whereObj = whereArr.reduce((obj, where) => {
      const [rawKey, value] = where.split('=');
      const [key, operator] = rawKey.split('|');
      if (operator && QUERY_OPERATORS[operator]) {
        obj[key] = QUERY_OPERATORS[operator](parseRawWhereValue(value));
        return obj;
      }
      obj[key] = parseRawWhereValue(value);
      return obj;
    }, {});
    acc[parentKey] = whereObj;
    return acc;
  }, {});
};

interface IParseQueryParamsProps {
  query: string | undefined;
  or?: boolean;
  allowedFields?: string[];
}

export const parseQueryParams = ({
  query,
  or = false,
  allowedFields = []
}: IParseQueryParamsProps): FindOptionsRelations<any> | FindOptionsWhere<any> => {
  if (!query) {
    return {};
  }
  const obj = convertParamsToObj(query, allowedFields);
  // Example or/and: OR: [{id:1}, {name: 'Stef'}] AND: {id: 1, name: 'Stef'}
  return or ? Object.keys(obj).reduce((acc, cur) => acc.concat(obj[cur]), []) : obj;
};

export const parsePaginationQueryParams = (
  takeParam: string | undefined,
  skipParam: string | undefined
): {
  take: number;
  skip: number;
} => {
  const take = Number(takeParam);
  const skip = Number(skipParam);
  return {
    take: Number.isNaN(take) || take > MAX_TAKE ? DEFAULT_TAKE : take,
    skip: Number.isNaN(skip) ? 0 : skip
  };
};
