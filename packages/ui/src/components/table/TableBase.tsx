import { flexRender } from "@tanstack/react-table";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table";
import { Inbox, Loader2 } from "lucide-react";
import type { TableBaseProps } from "./types";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function TableBase<TData>({
  table,
  columns,
  isLoading,
  loadingText = "Loading...",
  emptyIcon = <Inbox className="h-8 w-8" />,
  emptyText = "No results found.",
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TableBaseProps<TData>) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="overflow-y-auto flex-1 [&>div]:h-full">
        <Table className={`border-t ${isLoading || !table.getRowModel().rows.length ? "h-full" : ""}`}>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    <p className="text-sm text-slate-500 font-medium">{loadingText}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="h-12 hover:bg-slate-50/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    {emptyIcon}
                    <p className="text-sm font-medium">{emptyText}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="shrink-0 border-t px-3 py-2">
        <div className="flex items-center justify-between gap-4">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(v) => {
                table.setPageSize(Number(v));
              }}
            >
              <SelectTrigger className="w-20" id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start">
                <SelectGroup>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (table.getCanPreviousPage()) table.previousPage();
                  }}
                  className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {(() => {
                const currentPage = table.getState().pagination.pageIndex;
                const totalPages = table.getPageCount();

                let visiblePages: number[] = [];
                if (totalPages <= 5) {
                  visiblePages = Array.from({ length: totalPages }, (_, i) => i);
                } else if (currentPage <= 2) {
                  visiblePages = [0, 1, 2, 3, 4, totalPages - 1];
                } else if (currentPage >= totalPages - 3) {
                  visiblePages = [0, totalPages - 5, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1];
                } else {
                  visiblePages = [0, currentPage - 1, currentPage, currentPage + 1, totalPages - 1];
                }

                return visiblePages.flatMap((pageIndex, idx, arr) => {
                  const showEllipsis = idx > 0 && pageIndex - arr[idx - 1] > 1;
                  const elements = [];
                  if (showEllipsis) {
                    elements.push(
                      <PaginationItem key={`ellipsis-${pageIndex}`}>
                        <PaginationEllipsis />
                      </PaginationItem>,
                    );
                  }
                  elements.push(
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(pageIndex);
                        }}
                        isActive={currentPage === pageIndex}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>,
                  );
                  return elements;
                });
              })()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (table.getCanNextPage()) table.nextPage();
                  }}
                  className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
