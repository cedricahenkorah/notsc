export type PaginatedResult<T> = {
  data: T[];
  totalCount: number;
  totalPages?: number;
  currentPage?: number;
  hasMore?: boolean;
  itemsPerPage?: number;
};
