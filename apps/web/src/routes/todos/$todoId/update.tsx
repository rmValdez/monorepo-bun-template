import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getFieldInvalid, handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { Switch } from "@workspace/ui/components/switch";
import { updateTodoFn } from "@/server/todo/todo.functions";
import { todoQueries } from "@/server/todo/todo.query";
import { type TUpdateTodoSchemaInput, updateTodoSchema } from "@/server/todo/todo.schema";

export const Route = createFileRoute("/todos/$todoId/update")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { todoItem } = Route.useRouteContext();

  const todoForm = useAppForm({
    defaultValues: {
      id: todoItem.id,
      title: todoItem.title,
      status: todoItem.status,
      description: todoItem.description,
    } as TUpdateTodoSchemaInput,
    validators: {
      onChange: updateTodoSchema,
      onSubmit: updateTodoSchema,
    },
    onSubmit: async ({ value }) => {
      updateTodoMutation.mutate({ data: value });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodoFn,
    onSuccess: (response) => {
      if (!response.success) {
        handleFormActionErrors(todoForm, response);
        return;
      }

      queryClient.invalidateQueries({ queryKey: todoQueries.all() });
      navigate({ to: "/todos" });
    },
    onError: (error) => {
      handleServerFnError(todoForm, error);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Update Todo</h1>
          <p className="text-muted-foreground mt-1">Modify your task details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todo Form</CardTitle>
          <CardDescription>Update the details below to save your changes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
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

                <todoForm.Field name="status">
                  {(field) => {
                    const isInvalid = getFieldInvalid(field, todoForm.state.isSubmitted);
                    return (
                      <Field
                        data-invalid={isInvalid}
                        className="flex flex-row items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-0.5">
                          <FieldLabel htmlFor={field.name}>Completed</FieldLabel>
                          <FieldDescription>Mark this task as finished.</FieldDescription>
                        </div>
                        <Switch
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                          onBlur={field.handleBlur}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </todoForm.Field>
              </FieldGroup>
            </FieldSet>

            <todoForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "Submitting..." : "Update Todo"}
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
