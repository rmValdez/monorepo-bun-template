import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@workspace/ui/hooks/use-debounce";
import { formatDate } from "@workspace/ui/lib/format";
import { ArrowLeft, CheckCircle2, Circle, Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import { type TListTodosResponse, updateTodoStatusFn } from "@/server/todo/todo.functions";
import { todoQueries } from "@/server/todo/todo.query";

export const Route = createFileRoute("/todos/")({
  loader: ({ context }) => {
    if (typeof window !== "undefined") {
      context.queryClient.ensureQueryData(todoQueries.listTodos());
    }
  },
  component: RouteComponent,
});

const STATUS_OPTIONS = [
  { label: "Done", value: "true", icon: CheckCircle2 },
  { label: "Pending", value: "false", icon: Circle },
] as const;

type TodoItem = TListTodosResponse["todos"][number];
const columnHelper = createColumnHelper<TodoItem>();

const todoColumns = [
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
  columnHelper.accessor("id", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="ID" />,
    cell: ({ getValue }) => <span className="font-mono text-xs font-semibold">{getValue()}</span>,
    enableSorting: true,
    enableHiding: false,
    enableColumnFilter: false,
    size: 80,
    meta: {
      label: "ID",
      placeholder: "Search ID...",
      variant: "text",
    },
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
    cell: ({ getValue }) => {
      const isComplete = getValue();
      return (
        <Badge variant="outline" className="py-1 [&>svg]:size-3.5">
          {isComplete ? <CheckCircle2 /> : <Circle />}
          {isComplete ? "Done" : "Pending"}
        </Badge>
      );
    },

    enableSorting: true,
    enableColumnFilter: true,
    size: 120,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [...STATUS_OPTIONS],
    },
  }),
  columnHelper.accessor("title", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Title" />,
    cell: ({ row, getValue }) => (
      <span
        className={`max-w-[500px] truncate font-medium ${row.original.status ? "line-through text-muted-foreground" : ""}`}
      >
        {getValue()}
      </span>
    ),
    enableSorting: true,
    enableColumnFilter: false,
    meta: {
      label: "Title",
      placeholder: "Search titles...",
      variant: "text",
    },
  }),
  columnHelper.accessor("description", {
    header: ({ column }) => <DataTableColumnHeader column={column} label="Description" />,
    cell: ({ getValue }) => (
      <span className="max-w-[300px] truncate text-muted-foreground text-sm">{getValue() ?? "—"}</span>
    ),
    enableSorting: false,
    enableColumnFilter: false,
    size: 250,
    meta: {
      label: "Description",
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
      <div className="mb-8 shrink-0">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
          <p className="text-muted-foreground mt-1">Manage your tasks and keep track of your progress.</p>
        </div>
        <Link to="/todos/create">
          <Button className="gap-2">
            <Plus className="size-4" />
            Create Todo
          </Button>
        </Link>
      </div>

      <TodoListTable />
    </div>
  );
}

function TodoListTable() {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "status", desc: false },
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [globalSearch, setGlobalSearch] = useState("");
  const debouncedSearch = useDebounce(globalSearch, 300);

  // Map columnFilters to the backend-expected shape
  const backendFilters = columnFilters
    .filter((f) => Array.isArray(f.value) && (f.value as string[]).length > 0)
    .map((f) => ({ id: f.id, value: f.value as string[] }));

  const todoQuery = useQuery(
    todoQueries.listTodos({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: debouncedSearch,
      sorts: sorting,
      filters: backendFilters.length > 0 ? backendFilters : undefined,
    }),
  );

  const statusMutation = useMutation({
    mutationFn: updateTodoStatusFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoQueries.all() });
    },
  });

  const actionsColumn: ColumnDef<TodoItem> = columnHelper.display({
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
              <Link to="/todos/$todoId" params={{ todoId: row.original.id.toString() }}>
                View
              </Link>
            }
          />
          <DropdownMenuItem
            render={
              <Link to="/todos/$todoId/update" params={{ todoId: row.original.id.toString() }}>
                Edit
              </Link>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              statusMutation.mutate({
                data: {
                  id: row.original.id,
                  status: !row.original.status,
                },
              });
            }}
          >
            {row.original.status ? "Mark as Pending" : "Mark as Done"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  });

  const allColumns = [...todoColumns, actionsColumn];

  const table = useReactTable({
    data: todoQuery.data?.todos ?? [],
    columns: allColumns,
    rowCount: todoQuery.data?.rowCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      sorting: [
        { id: "status", desc: false },
        { id: "createdAt", desc: true },
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
    <DataTable table={table} isLoading={todoQuery.isLoading}>
      <DataTableToolbar
        table={table}
        searchValue={globalSearch}
        onReset={() => setGlobalSearch("")}
        searchBar={
          <Input
            placeholder="Search by title or description..."
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
