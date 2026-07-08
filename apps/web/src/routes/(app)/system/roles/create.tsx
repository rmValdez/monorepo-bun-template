import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { handleFormActionErrors, handleServerFnError } from "@workspace/core/utils/form-utils";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@workspace/ui/components/field";
import { useAppForm } from "@workspace/ui/components/form/hooks";
import { Input } from "@workspace/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { createRoleWithPermissionsFn } from "@/server/roles-permission/role-permission.functions";
import { rolePermissionQueries } from "@/server/roles-permission/role-permission.queries";
import {
  createRoleWithPermissionsSchema,
  type TCreateRoleWithPermissionsSchemaInput,
} from "@/server/roles-permission/role-permission.schema";

export const Route = createFileRoute("/(app)/system/roles/create")({
  component: RouteComponent,
});

const getSubject = (name: string) => {
  const parts = name.split(":");
  const sub = parts[2] || "general";
  return sub
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [permSearch, setPermSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const allPermissionsQuery = useQuery(rolePermissionQueries.listPermissions());

  const defaultRoleValues: TCreateRoleWithPermissionsSchemaInput = {
    name: "",
    description: "",
    permissionIds: [],
  };

  const roleForm = useAppForm({
    defaultValues: defaultRoleValues,
    validators: {
      onChange: createRoleWithPermissionsSchema,
      onSubmit: createRoleWithPermissionsSchema,
    },
    onSubmit: async ({ value }) => {
      createRoleMutation.mutate({ data: value });
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: createRoleWithPermissionsFn,
    onSuccess: (response) => {
      if (!response.success) {
        handleFormActionErrors(roleForm, response);
        return;
      }

      queryClient.invalidateQueries({ queryKey: rolePermissionQueries.all });
      navigate({ to: "/system/roles" });
    },
    onError: (error) => {
      handleServerFnError(roleForm, error);
    },
  });

  // Grouping permissions
  const permissions = allPermissionsQuery.data ?? [];
  const filteredPermissions = permissions.filter((permission) => {
    const term = permSearch.toLowerCase();
    return permission.name.toLowerCase().includes(term) || (permission.description || "").toLowerCase().includes(term);
  });

  const grouped = filteredPermissions.reduce<Record<string, typeof permissions>>((acc, item) => {
    const subject = getSubject(item.name);
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/system/roles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Role</h1>
          <p className="text-muted-foreground mt-1 text-sm">Add a new role to the system.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Form</CardTitle>
          <CardDescription>Fill in the details below to create a new role.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              roleForm.handleSubmit();
            }}
          >
            <FieldSet>
              <FieldLegend>Role Details</FieldLegend>
              <FieldDescription>Basic information for the new role.</FieldDescription>
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <roleForm.AppField name="name">
                    {(field) => <field.Input label="Role Name" placeholder="Enter role name" />}
                  </roleForm.AppField>

                  <roleForm.AppField name="description">
                    {(field) => <field.Input label="Description" placeholder="Enter role description" />}
                  </roleForm.AppField>
                </div>
              </FieldGroup>
            </FieldSet>

            <div className="h-4" />
            <FieldSet>
              <FieldLegend>Role Permissions</FieldLegend>
              <FieldDescription>Select the permissions for this role.</FieldDescription>

              <div className="mb-4">
                <Input
                  placeholder="Search permissions..."
                  value={permSearch}
                  onChange={(e) => setPermSearch(e.target.value)}
                  className="h-9 w-full max-w-sm"
                />
              </div>

              <FieldGroup>
                <roleForm.AppField name="permissionIds">
                  {(field) => (
                    <div className="space-y-4">
                      {Object.entries(grouped).map(([subject, items]) => {
                        const selectedInGroup = items.filter((item) => field.state.value?.includes(item.id));
                        const allSelected = selectedInGroup.length === items.length && items.length > 0;
                        const isIndeterminate = selectedInGroup.length > 0 && selectedInGroup.length < items.length;
                        const isExpanded = expandedGroups[subject] !== false;

                        const toggleExpand = (open: boolean) => {
                          setExpandedGroups((prev) => ({
                            ...prev,
                            [subject]: open,
                          }));
                        };

                        return (
                          <Collapsible key={subject} open={isExpanded} onOpenChange={toggleExpand}>
                            <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm">
                              <div className="flex items-center justify-between p-4 bg-muted/20 border-b">
                                <CollapsibleTrigger
                                  render={
                                    <button
                                      type="button"
                                      className="flex items-center gap-3 font-semibold text-sm hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                                    />
                                  }
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="size-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                  )}
                                  <div>
                                    <span>{subject}</span>
                                    <span className="text-xs text-muted-foreground font-normal ml-2">
                                      ({selectedInGroup.length} of {items.length} selected)
                                    </span>
                                  </div>
                                </CollapsibleTrigger>
                                <div className="flex items-center gap-2">
                                  <label
                                    htmlFor={`select-all-${subject}`}
                                    className="text-xs text-muted-foreground cursor-pointer select-none"
                                  >
                                    Select All
                                  </label>
                                  <Checkbox
                                    id={`select-all-${subject}`}
                                    checked={allSelected}
                                    indeterminate={isIndeterminate}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.state.value || [];
                                      let newValues = [...currentValues];
                                      if (checked) {
                                        items.forEach((item) => {
                                          if (!newValues.includes(item.id)) {
                                            newValues.push(item.id);
                                          }
                                        });
                                      } else {
                                        const itemIds = items.map((item) => item.id);
                                        newValues = newValues.filter((id) => !itemIds.includes(id));
                                      }
                                      field.handleChange(newValues);
                                    }}
                                  />
                                </div>
                              </div>

                              <CollapsibleContent>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-12">Select</TableHead>
                                      <TableHead className="w-[300px]">Permission Name</TableHead>
                                      <TableHead>Description</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {items.map((permission) => {
                                      const isSelected = field.state.value?.includes(permission.id);
                                      return (
                                        <TableRow key={permission.id}>
                                          <TableCell>
                                            <Checkbox
                                              id={permission.id}
                                              checked={isSelected}
                                              onCheckedChange={(checked) => {
                                                const currentValues = field.state.value || [];
                                                let newValues: string[];
                                                if (checked) {
                                                  newValues = [...currentValues, permission.id];
                                                } else {
                                                  newValues = currentValues.filter((id) => id !== permission.id);
                                                }
                                                field.handleChange(newValues);
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <label
                                              htmlFor={permission.id}
                                              className="text-sm font-mono leading-none cursor-pointer"
                                            >
                                              {permission.name}
                                            </label>
                                          </TableCell>
                                          <TableCell className="text-muted-foreground text-xs">
                                            {permission.description || "-"}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        );
                      })}
                      {Object.keys(grouped).length === 0 && (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                          No matching permissions found.
                        </div>
                      )}
                    </div>
                  )}
                </roleForm.AppField>
              </FieldGroup>
            </FieldSet>

            <roleForm.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "Submitting..." : "Create Role"}
                  </Button>
                </div>
              )}
            </roleForm.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
