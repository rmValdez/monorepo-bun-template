import type { FileRoutesByTo } from "@/routeTree.gen";

export type NavRoutePath = keyof FileRoutesByTo;

export type BreadcrumbType = "link" | "page";

export interface BreadcrumbValue {
  title: string;
  path: NavRoutePath;
  type: BreadcrumbType;
}

// TODO: Add component variants for rendering each BreadcrumbType
