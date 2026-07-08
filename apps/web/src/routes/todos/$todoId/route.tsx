import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { todoQueries } from "@/server/todo/todo.query";

export const Route = createFileRoute("/todos/$todoId")({
  beforeLoad: async ({ context, params }) => {
    const todoId = Number(params.todoId);
    if (Number.isNaN(todoId)) throw redirect({ to: "/error", search: { reason: "bad_request" } });

    const todoItem = await context.queryClient.fetchQuery(todoQueries.getTodo(todoId));
    if (!todoItem) throw redirect({ to: "/error", search: { reason: "not_found" } });

    return { todoItem };
  },
  component: TodoLayout,
});

function TodoLayout() {
  return (
    <>
      <div className="mb-8">
        <Link
          to="/todos"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to todos
        </Link>
      </div>

      <Outlet />
    </>
  );
}
