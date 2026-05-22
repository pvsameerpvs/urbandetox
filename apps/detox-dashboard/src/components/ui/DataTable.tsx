"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@urbandetox/ui";

export type SortDirection = "asc" | "desc" | null;

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  cell: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string) => void;
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
  };
  footer?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortColumn,
  sortDirection,
  onSort,
  isLoading,
  emptyState,
  footer,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
        <div className="p-8 space-y-4 animate-pulse">
          <div className="h-4 bg-secondary rounded w-1/4" />
          <div className="h-4 bg-secondary rounded w-1/2" />
          <div className="h-4 bg-secondary rounded w-3/4" />
        </div>
      </Card>
    );
  }

  if (data.length === 0 && emptyState) {
    return (
      <Card className="border border-border/40 rounded-2xl bg-white">
        <CardContent className="p-12 text-center">
          {emptyState.icon && (
            <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              {emptyState.icon}
            </div>
          )}
          <h3 className="text-base font-bold">{emptyState.title}</h3>
          {emptyState.subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{emptyState.subtitle}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/[0.03]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                  style={{ width: col.width }}
                >
                  {col.sortable && onSort ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {col.header}
                      <SortIcon column={col.key} activeColumn={sortColumn} direction={sortDirection} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border/20 hover:bg-brand/[0.02] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3.5 ${
                      col.align === "right"
                        ? "text-right"
                        : col.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </Card>
  );
}

function SortIcon({
  column,
  activeColumn,
  direction,
}: {
  column: string;
  activeColumn?: string;
  direction?: SortDirection;
}) {
  if (column !== activeColumn || !direction) {
    return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50" />;
  }
  return direction === "asc" ? (
    <ArrowUp className="h-3 w-3 text-brand" />
  ) : (
    <ArrowDown className="h-3 w-3 text-brand" />
  );
}
