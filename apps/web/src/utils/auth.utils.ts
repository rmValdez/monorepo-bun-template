import type { OrganizationType } from "@workspace/db/types";

export type DashboardPath = "/" | "/system" | "/dashboard";

const ORGANIZATION_DASHBOARD_MAP: Record<OrganizationType, DashboardPath> = {
  SYSTEM: "/system",
  WORKSPACE: "/dashboard",
};

export function getDashboardPath(organizationType: OrganizationType | undefined | null): DashboardPath {
  if (!organizationType) return "/";
  return ORGANIZATION_DASHBOARD_MAP[organizationType];
}
