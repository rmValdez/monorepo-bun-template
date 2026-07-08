// TODO: this is still not functional!
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSet } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { SelectItem } from "@workspace/ui/components/select";
import { ArrowLeft } from "lucide-react";
import { organizationQueries } from "@/server/organization/organization.queries";
import { rolePermissionQueries } from "@/server/roles-permission/role-permission.queries";
import { createUserFn } from "@/server/users/users.functions";
import { userQueries } from "@/server/users/users.query";
import { createUserSchema, type TCreateUserSchemaInput } from "@/server/users/users.schema";

export const Route = createFileRoute("/(app)/system/users/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const allRolesQuery = useQuery(rolePermissionQueries.listRoles({ pageSize: 100 }));
  const roles = allRolesQuery.data?.data ?? [];

  const allOrganizationsQuery = useQuery(organizationQueries.list());
  const organizations = allOrganizationsQuery.data ?? [];

  const userForm = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      status: "ACTIVE",
      roleIds: [],
      organizationId: "",
    } as TCreateUserSchemaInput,
    validators: {
      onChange: createUserSchema,
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      createUserMutation.mutate({ data: value });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUserFn,
    onSuccess: (response) => {
      if (!response.success) {
        handleFormActionErrors(userForm, response);
        return;
      }

      queryClient.invalidateQueries({ queryKey: userQueries.all() });
      navigate({ to: "/system/users" });
    },
    onError: (error) => {
      handleServerFnError(userForm, error);
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/system/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create User</h1>
          <p className="text-muted-foreground mt-1 text-sm">Add a new user administration profile.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Fill in the details below to register a new user in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              userForm.handleSubmit();
            }}
            className="space-y-6"
          >
            <FieldSet>
              <FieldLegend>Account Profile</FieldLegend>
              <FieldDescription>Identity and security details of the user profile.</FieldDescription>
              <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <userForm.AppField name="name">
                    {(field) => <field.Input label="Name" placeholder="Enter user name" />}
                  </userForm.AppField>

                  <userForm.AppField name="email">
                    {(field) => <field.Input label="Email Address" placeholder="Enter email address" />}
                  </userForm.AppField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <userForm.AppField name="status">
                    {(field) => (
                      <field.Select label="Status" placeholder="Select status">
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </field.Select>
                    )}
                  </userForm.AppField>

                  <userForm.AppField name="organizationId">
                    {(field) => (
                      <field.Select label="Organization" placeholder="Select organization">
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </field.Select>
                    )}
                  </userForm.AppField>
                </div>
              </FieldGroup>
            </FieldSet>

            <userForm.AppField name="roleIds">
              {(field) => (
                <FieldSet>
                  <FieldLegend>System Roles</FieldLegend>
                  <FieldDescription>Select the system-wide roles to grant this user.</FieldDescription>
                  <FieldGroup>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {roles.map((role) => {
                        const checked = field.state.value?.includes(role.id) ?? false;
                        return (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                const currentVal = field.state.value ?? [];
                                if (isChecked) {
                                  field.setValue([...currentVal, role.id]);
                                } else {
                                  field.setValue(currentVal.filter((id) => id !== role.id));
                                }
                              }}
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="text-sm font-medium leading-none cursor-pointer"
                            >
                              {role.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </FieldGroup>
                </FieldSet>
              )}
            </userForm.AppField>

            <userForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "Submitting..." : "Create User"}
                  </Button>
                </div>
              )}
            </userForm.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
