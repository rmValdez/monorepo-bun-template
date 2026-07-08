import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { OrganizationType } from "@workspace/db/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { CheckSquare, LayoutDashboard } from "lucide-react";
import { AppSidebar, AppSidebarProvider, type NavItem } from "@/components/sidebar/app-sidebar";

export const Route = createFileRoute("/(app)/dashboard")({
  beforeLoad: ({ context }) => {
    if (context.authDetails.organization.type !== OrganizationType.WORKSPACE) {
      throw redirect({ to: "/error", search: { reason: "permission_denied" } });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AppSidebarProvider sidebar={<DashboardSidebar />}>
      <Outlet />
    </AppSidebarProvider>
  );
}

const DashboardSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroupLabel className="-mb-3">Workspace</SidebarGroupLabel>
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
    url: "/dashboard",
  },
  {
    title: "Todos",
    icon: <CheckSquare />,
    url: "/todos",
  },
];
