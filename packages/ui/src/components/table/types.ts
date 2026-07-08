import type { ColumnDef, Table } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type TableBaseProps<TData> = {
  table: Table<TData>;
  // biome-ignore lint/suspicious/noExplicitAny: this is fine (●'◡'●)
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  loadingText?: string;
  emptyIcon?: ReactNode;
  emptyText?: string;
  pageSizeOptions?: number[];
};
