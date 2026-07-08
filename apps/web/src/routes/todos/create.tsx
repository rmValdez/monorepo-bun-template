import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { ArrowLeft } from "lucide-react";
import { createTodoFn } from "@/server/todo/todo.functions";
import { todoQueries } from "@/server/todo/todo.query";
import { createTodoSchema, type TCreateTodoSchemaInput } from "@/server/todo/todo.schema";

export const Route = createFileRoute("/todos/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const todoForm = useAppForm({
    defaultValues: {
      title: "",
      description: "",
    } as TCreateTodoSchemaInput,
    validators: {
      onChange: createTodoSchema,
      onSubmit: createTodoSchema,
    },
    onSubmit: async ({ value }) => {
      createTodoMutation.mutate({ data: value });
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: createTodoFn,
    onSuccess: (response) => {
      if (!response.success) {
        handleFormActionErrors(todoForm, response);
        return;
      }

      queryClient.invalidateQueries({ queryKey: todoQueries.all() });
      navigate({ to: "/todos/$todoId", params: { todoId: String(response.data.id) } });
    },
    onError: (error) => {
      handleServerFnError(todoForm, error);
    },
  });

  return (
    <>
      <div className="mb-8">
        <Link
          to="/todos"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Todos
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Todo</h1>
          <p className="text-muted-foreground mt-1">Create a new task to get things done.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo Form</CardTitle>
          <CardDescription>Fill in the details below to create a new task.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              todoForm.handleSubmit();
            }}
          >
            <FieldSet>
              <FieldLegend>Todo Details</FieldLegend>
              <FieldDescription>Fill in the details below to create a new task.</FieldDescription>
              <FieldGroup>
                <todoForm.AppField name="title">
                  {(field) => <field.Input label="Title" placeholder="Enter todo title" />}
                </todoForm.AppField>

                <todoForm.AppField name="description">
                  {(field) => <field.Input label="Description" placeholder="Enter todo description" />}
                </todoForm.AppField>
              </FieldGroup>
            </FieldSet>

            <todoForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "Submitting..." : "Create Todo"}
                  </Button>
                </div>
              )}
            </todoForm.Subscribe>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
