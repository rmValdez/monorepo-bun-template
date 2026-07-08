import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/todos")({
  component: TodosLayout,
});

function TodosLayout() {
  return (
    <div className="h-svh overflow-hidden bg-background flex flex-col">
      <div className="mx-auto max-w-5xl w-full flex-1 py-14 flex flex-col min-h-0">
        <Outlet />
      </div>
    </div>
  );
}
