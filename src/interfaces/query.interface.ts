export interface ReqQueryDto {
  page: number;
  sort: string;
  limit: number;
  fields: string;
}

export interface ReqQueryPagination {
  limit: number;
  skip: number;
}
