import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireAuthMiddleware } from "@/server/auth/auth.middleware";
import { NotFoundError } from "@/utils/errors.util";
import { getOrganization, listOrganizations } from "./organization.service";

export const getOrganizationFn = createServerFn({ method: "GET" })
  .validator(z.object({ organizationId: z.string() }))
  .middleware([requireAuthMiddleware])
  .handler(async ({ data }) => {
    const organization = await getOrganization(data.organizationId);

    if (!organization) {
      throw new NotFoundError("Organization not found");
    }

    return organization;
  });

export const listOrganizationsFn = createServerFn({ method: "GET" })
  .middleware([requireAuthMiddleware])
  .handler(async () => {
    return listOrganizations();
  });
