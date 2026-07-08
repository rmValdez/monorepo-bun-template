import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { DataTablePagination } from "@workspace/ui/components/data-table/data-table-pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { getColumnPinningStyle } from "@workspace/ui/lib/data-table";
import { cn } from "@workspace/ui/lib/utils";
import { Inbox, Loader2 } from "lucide-react";
import type * as React from "react";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  emptyIcon?: React.ReactNode;
  emptyText?: string;
}

export function DataTable<TData>({
  table,
  actionBar,
  isLoading,
  loadingText = "Loading...",
  emptyIcon = <Inbox className="h-8 w-8" />,
  emptyText = "No results.",
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const hasRows = table.getRowModel().rows?.length > 0;
  const showFullHeight = isLoading || !hasRows;

  return (
    <div className={cn("flex w-full flex-1 flex-col gap-2.5 overflow-hidden", className)} {...props}>
      {children}
      <div className="overflow-y-auto flex-1 rounded-md border [&>div]:h-full">
        <Table className={cn(showFullHeight && "h-full")}>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getAllColumns().length} className="text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">{loadingText}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={table.getAllColumns().length} className="text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    {emptyIcon}
                    <p className="text-sm font-medium">{emptyText}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5 shrink-0">
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
}
