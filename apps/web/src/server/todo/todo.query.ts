import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getTodoFn, listTodosFn } from "./todo.functions";
import type { TPaginationSchemaInput } from "./todo.schema";

export const todoQueries = {
  all: () => ["todos"] as const,
  listTodos: (params?: TPaginationSchemaInput) => {
    const pageIndex = params?.pageIndex ?? 0;
    const pageSize = params?.pageSize ?? 10;
    const search = params?.search;
    const sorts = params?.sorts;
    const filters = params?.filters;
    return queryOptions({
      queryKey: [...todoQueries.all(), "list", pageIndex, pageSize, search, sorts, filters],
      queryFn: () => listTodosFn({ data: { pageIndex, pageSize, search, sorts, filters } }),
      staleTime: 1000 * 30,
      placeholderData: keepPreviousData,
    });
  },
  getTodo: (id: number) =>
    queryOptions({
      queryKey: [...todoQueries.all(), id],
      queryFn: () => getTodoFn({ data: id }),
    }),
};
