import { Link, useRouterState } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Fragment } from "react";
import type { BreadcrumbValue } from "@/components/breadcrumb/breadcrumb-item";

function hasBreadcrumb(data: unknown): data is { breadcrumb: BreadcrumbValue } {
  return !!data && typeof data === "object" && "breadcrumb" in data;
}

export function TopbarBreadcrumb() {
  const matches = useRouterState({
    select: (s) => s.matches,
  });

  const breadcrumbs = matches.flatMap((match) =>
    hasBreadcrumb(match.loaderData) ? [match.loaderData.breadcrumb] : [],
  );

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <Fragment key={`${crumb.title}`}>
              <BreadcrumbItem>{renderBreadcrumb(crumb, isLast)}</BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

// TODO: Add other breadcrumb types here
// TODO: Create components for each type of breadcrumb in src\components\layout\breadcrumb-item.tsx

const renderBreadcrumb = (crumb: BreadcrumbValue, isLast: boolean) => {
  if (isLast && crumb.type === "link") {
    return <BreadcrumbPage>{crumb.title}</BreadcrumbPage>;
  }

  switch (crumb.type) {
    case "link":
      return <BreadcrumbLink render={<Link to={crumb.path} />}>{crumb.title}</BreadcrumbLink>;
    default:
      return <BreadcrumbPage>{crumb.title}</BreadcrumbPage>;
  }
};
