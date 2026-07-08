import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getUserFn, listUsersFn } from "./users.functions";
import type { TPaginationSchemaInput } from "./users.schema";

export const userQueries = {
  all: () => ["users"] as const,
  listUsers: (params?: TPaginationSchemaInput) => {
    const pageIndex = params?.pageIndex ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search;
    const sorts = params?.sorts;
    const filters = params?.filters;
    return queryOptions({
      queryKey: [...userQueries.all(), "list", pageIndex, pageSize, search, sorts, filters],
      queryFn: () => listUsersFn({ data: { pageIndex, pageSize, search, sorts, filters } }),
      staleTime: 1000 * 30, // 30 seconds
      placeholderData: keepPreviousData,
    });
  },
  getUser: (id: string) =>
    queryOptions({
      queryKey: [...userQueries.all(), id],
      queryFn: () => getUserFn({ data: id }),
    }),
};
