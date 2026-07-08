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
import { Badge } from "@workspace/ui/components/badge";
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
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import type { TListUsersResponse } from "@/server/users/users.functions";
import { userQueries } from "@/server/users/users.query";

export const Route = createFileRoute("/(app)/system/users/")({
  loader: ({ context }) => {
    if (typeof window !== "undefined") {
      context.queryClient.ensureQueryData(userQueries.listUsers());
    }
  },
  component: RouteComponent,
});

type UserItem = TListUsersResponse["data"][number];
const columnHelper = createColumnHelper<UserItem>();

const userColumns = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
    cell: ({ getValue }) => <span className="font-mono text-sm">{getValue()}</span>,
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: false,
    meta: {
      label: "Name",
    },
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
    cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue()}</span>,
    enableSorting: true,
    enableColumnFilter: false,
    meta: {
      label: "Email",
    },
  }),
  columnHelper.display({
    id: "organization",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Organization" />,
    cell: ({ row }) => {
      const orgNames =
        row.original.members
          ?.map((m) => m.organization?.name)
          .filter(Boolean)
          .join(", ") || "-";
      return <span className="text-sm text-muted-foreground">{orgNames}</span>;
    },
  }),
  columnHelper.display({
    id: "roles",
    header: ({ column }) => <DataTableColumnHeader column={column} label="Roles" />,
    cell: ({ row }) => {
      const rolesStr =
        row.original.members
          ?.flatMap((m) => m.memberRoles?.map((mr) => mr.role?.name))
          .filter(Boolean)
          .join(", ") || "-";
      return <span className="text-sm text-muted-foreground">{rolesStr}</span>;
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <Badge variant={status === "ACTIVE" ? "default" : status === "INACTIVE" ? "secondary" : "destructive"}>
          {status}
        </Badge>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Suspended", value: "SUSPENDED" },
      ],
    },
    size: 100,
  }),
  columnHelper.accessor("createdAt", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
    cell: ({ getValue }) => <span className="text-muted-foreground text-sm">{formatDate(getValue())}</span>,
    enableSorting: true,
    size: 160,
  }),
];

function RouteComponent() {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Administration</h1>
          <p className="text-muted-foreground mt-1">Manage platform users, roles, and status levels.</p>
        </div>
        {/* TODO: not required! */}
        {/* <Link to="/system/users/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Create User
          </Button>
        </Link> */}
      </div>

      <UsersListTable />
    </div>
  );
}

function UsersListTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [globalSearch, setGlobalSearch] = useState("");
  const debouncedSearch = useDebounce(globalSearch, 300);

  const backendFilters = columnFilters
    .map((filter) => {
      if (Array.isArray(filter.value)) {
        return {
          id: filter.id,
          value: filter.value,
        };
      }
      return null;
    })
    .filter(Boolean) as { id: string; value: string[] }[];

  const usersQuery = useQuery(
    userQueries.listUsers({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sorts: sorting,
      filters: backendFilters.length > 0 ? backendFilters : undefined,
    }),
  );

  const actionsColumn: ColumnDef<UserItem> = columnHelper.display({
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
              <Link to="/system/users/$userId" params={{ userId: row.original.id }}>
                View
              </Link>
            }
          />
          {/* TODO: not required! */}
          {/* <DropdownMenuItem
            render={
              <Link to="/system/users/$userId/update" params={{ userId: row.original.id }}>
                Update
              </Link>
            }
          /> */}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  const allColumns = [...userColumns, actionsColumn];

  const table = useReactTable({
    data: usersQuery.data?.data ?? [],
    columns: allColumns,
    rowCount: usersQuery.data?.total,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
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
    <DataTable table={table} isLoading={usersQuery.isLoading}>
      <DataTableToolbar
        table={table}
        searchValue={globalSearch}
        onReset={() => setGlobalSearch("")}
        searchBar={
          <Input
            placeholder="Search name or email"
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
