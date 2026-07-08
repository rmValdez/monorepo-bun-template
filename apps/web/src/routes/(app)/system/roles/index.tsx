import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  type ColumnDef,
  type ColumnFiltersState,
  createColumnHelper,
  getCoreRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { DataTable } from "@workspace/ui/components/data-table/data-table";
import { DataTableColumnHeader } from "@workspace/ui/components/data-table/data-table-column-header";
import { DataTableSortList } from "@workspace/ui/components/data-table/data-table-sort-list";
import { DataTableToolbar } from "@workspace/ui/components/data-table/data-table-toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { formatDate } from "@workspace/ui/lib/format";
import { Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import type { TListRolesResponse } from "@/server/roles-permission/role-permission.functions";
import { rolePermissionQueries } from "@/server/roles-permission/role-permission.queries";

export const Route = createFileRoute("/(app)/system/roles/")({
  loader: ({ context }) => {
    if (typeof window !== "undefined") {
      context.queryClient.ensureQueryData(rolePermissionQueries.listRoles());
    }
  },
  component: RouteComponent,
});

type RoleItem = TListRolesResponse["data"][number];
const columnHelper = createColumnHelper<RoleItem>();

const roleColumns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        className="translate-y-0.5"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        className="translate-y-0.5"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    size: 40,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Role Name" />,
    cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: false,
    meta: {
      label: "Role Name",
      placeholder: "Search role name...",
      variant: "text",
    },
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Description" />,
    cell: ({ getValue }) => (
      <div className="max-w-[400px] truncate text-muted-foreground">{getValue() ?? "-"}</div>
    ),
    enableSorting: true,
    enableColumnFilter: false,
    meta: {
      label: "Description",
      placeholder: "Search description...",
      variant: "text",
    },
  }),
  columnHelper.accessor("permissions", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Permissions" />,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{getValue()?.length ?? 0}</span>
      </div>
    ),
    enableSorting: false,
    meta: {
      label: "Permissions",
    },
  }),
  columnHelper.accessor((row) => row._count?.memberRoles ?? 0, {
    id: "members",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Members" />,
    cell: ({ getValue }) => <span className="text-xs text-muted-foreground">{getValue()}</span>,
    enableSorting: false,
    size: 100,
    meta: {
      label: "Members",
    },
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    cell: ({ getValue }) => <span className="text-muted-foreground text-sm">{formatDate(getValue())}</span>,
    enableSorting: true,
    size: 160,
    meta: {
      label: "Created At",
    },
  }),
];

function RouteComponent() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles and Permissions</h1>
          <p className="text-muted-foreground mt-1">Manage your roles and permissions.</p>
        </div>
        <Link to="/system/roles/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Create Role
          </Button>
        </Link>
      </div>

      <RolesListTable />
    </div>
  );
}

function RolesListTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [globalSearch, setGlobalSearch] = useState("");
  const debouncedSearch = useDebounce(globalSearch, 300);

  const roleQuery = useQuery(
    rolePermissionQueries.listRoles({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sorts: sorting,
    }),
  );

  const actionsColumn: ColumnDef<RoleItem> = columnHelper.display({
    id: "actions",
    size: 40,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            render={
              <Link to="/system/roles/$roleId/update" params={{ roleId: row.original.id }}>
                Update
              </Link>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  const allColumns = [...roleColumns, actionsColumn];

  const table = useReactTable({
    data: roleQuery.data?.data ?? [],
    columns: allColumns,
    rowCount: roleQuery.data?.total,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [
        { id: "name", desc: false },
      ],
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <DataTable table={table} isLoading={roleQuery.isLoading}>
      <DataTableToolbar
        table={table}
        searchValue={globalSearch}
        onReset={() => setGlobalSearch("")}
        searchBar={
          <Input
            placeholder="Search roles..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="h-8 w-[200px] lg:w-[300px]"
          />
        }
      >
        <DataTableSortList table={table} align="end" />
      </DataTableToolbar>
    </DataTable>
  );
}
