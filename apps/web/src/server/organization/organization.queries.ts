import { queryOptions } from "@tanstack/react-query";
import { getOrganizationFn, listOrganizationsFn } from "./organization.functions";

export const organizationQueries = {
  all: ["organization"] as const,
  getOrganization: (organizationId: string) =>
    queryOptions({
      queryKey: [...organizationQueries.all, organizationId],
      queryFn: () => getOrganizationFn({ data: { organizationId } }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
  list: () =>
    queryOptions({
      queryKey: [...organizationQueries.all, "list"],
      queryFn: () => listOrganizationsFn(),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
};
