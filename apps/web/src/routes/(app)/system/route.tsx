import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { OrganizationType } from "@workspace/db/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { LayoutDashboard, ShieldCheckIcon, Users } from "lucide-react";
import { AppSidebar, AppSidebarProvider, type NavItem } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/(app)/system")({
  beforeLoad: ({ context }) => {
    if (context.authDetails.organization.type !== OrganizationType.SYSTEM) {
      throw redirect({ to: "/error", search: { reason: "permission_denied" } });
    }
  },
  component: SystemLayout,
});

function SystemLayout() {
  return (
    <AppSidebarProvider sidebar={<SystemSidebar />}>
      <Outlet />
    </AppSidebarProvider>
  );
}

const SystemSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroupLabel className="-mb-3">Admin</SidebarGroupLabel>
        <AppSidebar items={routes} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
};

const routes: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard />,
    url: "/system",
  },
  {
    title: "Users",
    icon: <Users />,
    url: "/system/users",
  },
  {
    title: "Roles & Permissions",
    icon: <ShieldCheckIcon />,
    url: "/system/roles",
  },
];
