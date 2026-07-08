import { Link, useLocation } from "@tanstack/react-router";
import type { Permission } from "@workspace/core/roles-and-permissions/permissions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { ChevronRightIcon } from "lucide-react";
import { usePermissions } from "@/hooks/use-permission";
import type { FileRoutesByTo } from "@/routeTree.gen";

export function AppSidebarProvider({ sidebar, children }: { sidebar?: React.ReactNode; children: React.ReactNode }) {
  return (
    <SidebarProvider
      className="h-full overflow-hidden"
      style={
        {
          "--sidebar-width": "15rem",
          "--sidebar-width-icon": "3rem",
          "--sidebar-offset": "3rem",
        } as React.CSSProperties
      }
    >
      {sidebar}
      <SidebarInset>
        <div className="flex-1 overflow-auto flex flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export type NavRoutePath = keyof FileRoutesByTo;

export interface NavSubItem {
  title: string;
  url?: NavRoutePath;
  icon?: React.ReactNode;
  items?: { title: string; url: NavRoutePath }[];
  permission?: Permission | [Permission, ...Permission[]];
}

export interface NavItem {
  title: string;
  url?: NavRoutePath;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: NavSubItem[];
  permission?: Permission | [Permission, ...Permission[]];
}

export function AppSidebar({ items }: { items: NavItem[] }) {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { can } = usePermissions();

  const isAllowed = (permission?: Permission | [Permission, ...Permission[]]) => {
    if (!permission) return true;
    return can(permission);
  };

  const visibleItems = items
    .filter((item) => isAllowed(item.permission))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) => isAllowed(subItem.permission)),
    }));

  return (
    <SidebarGroup>
      <SidebarMenu>
        {visibleItems.map((item) => {
          const hasChildren = item.items && item.items.length > 0;
          const isItemActive = hasChildren
            ? item.isActive || item.items?.some((s) => s.url === pathname || s.items?.some((l) => l.url === pathname))
            : pathname === item.url;

          if (!hasChildren) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isItemActive}
                  render={item.url ? <Link to={item.url} preload={false} /> : undefined}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              defaultOpen={isItemActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} isActive={isItemActive} />}>
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isSubGroupActive = subItem.items?.some((leaf) => leaf.url === pathname);

                    return subItem.items && subItem.items.length > 0 ? (
                      /* Nested collapsible sub-group (e.g. Authorizations) */
                      <Collapsible key={subItem.title} defaultOpen={isSubGroupActive} render={<SidebarMenuSubItem />}>
                        <CollapsibleTrigger
                          nativeButton={false}
                          render={<SidebarMenuSubButton isActive={isSubGroupActive} />}
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                          <ChevronRightIcon className="ml-auto h-3 w-3 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 border-l-0 pl-2">
                            {subItem.items.map((leaf) => (
                              <SidebarMenuSubItem key={leaf.title}>
                                <SidebarMenuSubButton
                                  render={leaf.url ? <Link to={leaf.url} preload={false} /> : undefined}
                                >
                                  <span>{leaf.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      /* Flat sub-item */
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isSubGroupActive}
                          render={subItem.url ? <Link to={subItem.url} preload={false} /> : undefined}
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
