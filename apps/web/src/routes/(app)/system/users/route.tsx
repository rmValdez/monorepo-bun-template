import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/system/users")({
  component: UsersLayout,
});

function UsersLayout() {
  return (
    <div className="flex-1 flex flex-col p-3">
      <Outlet />
    </div>
  );
}
