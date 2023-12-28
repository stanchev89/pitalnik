import { IAllowedQueryFields } from '../../interfaces/allowed-query-fields';
import { Request } from 'express';
import { PAGINATION, QueryClause } from '../../enums/query-clause.enum';
import { parsePaginationQueryParams, parseQueryParams } from '../../utils/parse-query-param';

export const enrichReqWithQueryParams = (allowedFields: IAllowedQueryFields<any>, req: Request) => {
  const {
    [QueryClause.RELATIONS]: relationsParam,
    [QueryClause.WHERE]: whereParam,
    [QueryClause.WHERE_OR]: whereOrParam,
    [QueryClause.TAKE]: takeParam,
    [QueryClause.SKIP]: skipParam,
    [QueryClause.ORDER]: orderParam
  } = req.query as { [key: string]: string };
  const relations = parseQueryParams({ query: relationsParam, allowedFields: allowedFields.relations });
  const isWhereOr = !whereParam && !!whereOrParam;
  const where = parseQueryParams({
    query: isWhereOr ? whereOrParam : whereParam,
    allowedFields: allowedFields['where'] as string[],
    or: isWhereOr
  });
  const order = parseQueryParams({ query: orderParam, allowedFields: allowedFields.order as string[] });
  const { take, skip } = parsePaginationQueryParams(takeParam, skipParam);
  req[QueryClause.RELATIONS] = relations;
  req[QueryClause.WHERE] = where;
  req[QueryClause.ORDER] = order;
  req[PAGINATION] = {
    [QueryClause.SKIP]: skip,
    [QueryClause.TAKE]: take
  };
  return req;
};
