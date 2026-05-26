export type WithPagination<T extends object> = T & {
  limit?: number;
  offset?: number;
};
