import type { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/core/table"
import { Skeleton } from "@/components/core/skeleton"

export type Column<T> = {
  header: string
  cell: (row: T) => ReactNode
}

type Props<T> = {
  rows: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyText?: string
}

export function DataTable<T>({ rows, columns, loading, emptyText }: Props<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.header}>{c.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading &&
            (() => {
              const rows: number[] = []
              for (let i = 0; i < 5; i++) rows.push(i)
              return rows.map((i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c.header}>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            })()}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-muted-foreground py-12"
              >
                {emptyText ?? "No results."}
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            rows.length > 0 &&
            rows.map((row, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell key={c.header}>{c.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
