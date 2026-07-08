import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import type { AuthDetails } from "@/server/auth/auth.functions";
import { getDashboardPath } from "@/utils/auth.utils";
import { TopbarBreadcrumb } from "../breadcrumb/topbar-breadcrumb";

export default function AppTopbar({ authDetails }: { authDetails: AuthDetails }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, organization } = authDetails;

  const handleLogout = async () => {
    queryClient.clear();
    await queryClient.invalidateQueries();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/login" });
        },
      },
    });
  };

  return (
    <div className="w-full flex flex-row sticky top-0 z-50">
      {/* h12 is 3rem so the sidebar top should be 3rem */}
      <nav className="z-10 w-full h-12 border-b bg-background border-border flex flex-row items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="-ml-2 flex items-center gap-2 px-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary/15 border border-primary/20">
              <span className="text-primary font-bold text-xs">B</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold tracking-tight">bun-monorepo-template</span>
          </Link>

          <TopbarBreadcrumb />
        </div>

        <div className="flex items-center gap-4">
          {/* <NotificationsPopover /> */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {/* TODO: Implement user profile image */}
                {/* <AvatarImage className="size-8" src={"/avatars/laugh-orange-cat.gif"} alt={user.name} /> */}
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex flex-col gap-0.5 px-2 py-2 text-left">
                    <span className="text-sm font-semibold text-slate-800 truncate">{user.name}</span>
                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={"/profile"}>
                  <DropdownMenuItem>
                    <UserIcon />
                    My Profile
                  </DropdownMenuItem>
                </Link>
                <Link to={getDashboardPath(organization.type)}>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
              >
                <LogOutIcon />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
}
