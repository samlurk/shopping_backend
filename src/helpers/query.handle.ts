import type { MongodbOPerators } from '../interfaces/mongodb.interface';
import type { ReqQueryDto, ReqQueryPagination } from '../interfaces/query.interface';
import { checkObjectIdOnAnObject } from './mongo.handle';

export const handleReqQuery = (reqQuery: Partial<ReqQueryDto>): MongodbOPerators => {
  //* Changing the data type of the comparison query operators value
  const queryStr = JSON.stringify(reqQuery)
    .replace(/\b(gte|gt|lte|lt|or)\b/g, (match) => `$${match}`)
    .replace(/\W\d+\W/gm, (match) => match.slice(1, match.length - 1));

  const {
    fields: reqFields,
    limit: reqLimit,
    page: reqPage,
    sort: reqSort,
    ...queryToMatch
  }: ReqQueryDto = JSON.parse(queryStr);

  const match = checkObjectIdOnAnObject(queryToMatch) as object;
  const { limit, skip } = queryPagination(reqLimit, reqPage);
  const sort = sortingQueryByFields(reqSort);
  const fields = limitingQueryByFields(reqFields);

  return {
    limit,
    skip,
    match,
    projection: fields,
    sort
  };
};

//* Pagination
const queryPagination = (reqLimit: number | undefined, reqPage: number | undefined): ReqQueryPagination => {
  const pagination: ReqQueryPagination = { limit: 10, skip: 0 };

  pagination.limit = typeof reqLimit === 'number' ? reqLimit : pagination.limit;
  pagination.skip = typeof reqPage === 'number' ? (reqPage - 1) * pagination.limit : pagination.skip;

  return pagination;
};

//* Sorting
export const sortingQueryByFields = (reqSort: string | undefined): object => {
  if (typeof reqSort === 'string') {
    let sort = {};
    let operator = -1;
    reqSort.split(',').forEach((field) => {
      if (field.search(/^[a-zA-Z]+$/g) !== -1) {
        operator = 1;
      }
      if (field.search(/^-+[a-zA-Z]+$/g) !== -1) {
        field = field.slice(1, field.length);
      }
      sort = { ...sort, ...JSON.parse(`{"${field}": ${operator}}`) };
    });
    return sort;
  }
  return { createAt: -1 };
};

//* Limiting fields
export const limitingQueryByFields = (reqFields: string | undefined): object => {
  if (typeof reqFields === 'string') {
    let limitFields = {};
    reqFields.split(',').forEach((field) => {
      limitFields = { ...limitFields, ...JSON.parse(`{"${field}": 1}`) };
    });
    return limitFields;
  }
  return { showAllProperties: 0 };
};
