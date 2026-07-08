import { queryOptions } from "@tanstack/react-query";
import { getAuthDetailsFn, getAuthSessionFn } from "./auth.functions";

export const authQueries = {
  all: () => ["auth"] as const,
  getAuthSession: () =>
    queryOptions({
      queryKey: [...authQueries.all(), "session"],
      queryFn: () => getAuthSessionFn(),
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
    }),
  getAuthDetails: () =>
    queryOptions({
      queryKey: [...authQueries.all(), "detail"],
      queryFn: () => getAuthDetailsFn(),
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 5,
      refetchOnReconnect: true,
    }),
};
