export type PaginationParams = { page: number; limit: number };

export const PAGINATE_SORT = { createdAt: -1 } as const;

export const parsePaginationParams = (
  page?: string,
  limit?: string,
): PaginationParams => ({
  page: Number(page) || 1,
  limit: Number(limit) || 10,
});
