import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { CheckCircle2, Clock, FileText, Hash } from "lucide-react";

export const Route = createFileRoute("/todos/$todoId/")({
  component: ViewTodoPage,
});

function ViewTodoPage() {
  const { todoItem } = Route.useRouteContext();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">View Todo</h1>
          <p className="text-muted-foreground mt-1">Details for your task.</p>
        </div>
        <Link to="/todos/$todoId/update" params={{ todoId: todoItem.id.toString() }}>
          <Button variant="outline" className="gap-2">
            Edit Todo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{todoItem.title}</CardTitle>
              <CardDescription>Created on {new Date(todoItem.createdAt).toLocaleString()}</CardDescription>
            </div>
            {todoItem.status ? (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-500">
                <CheckCircle2 className="size-4" />
                Completed
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500">
                <Clock className="size-4" />
                In Progress
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="size-4" />
                Todo ID
              </span>
              <p className="text-base font-medium">{todoItem.id}</p>
            </div>
            <div className="space-y-1">
              <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <FileText className="size-4" />
                Description
              </span>
              <p className="text-base">{todoItem.description || "No description provided."}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
