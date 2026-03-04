export type PaginationParams = { page: number; limit: number };

export const PAGINATE_SORT = { createdAt: -1 } as const;

export const parsePaginationParams = (
  page?: number,
  limit?: number,
): PaginationParams => ({
  page: Number(page) || 1,
  limit: Number(limit) || 10,
});
