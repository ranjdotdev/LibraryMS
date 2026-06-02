import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { listMyBorrowings } from "@/features/borrowings/api"
import { DataTable } from "@/components/blocks/data-table"
import { Pagination } from "@/components/blocks/pagination"
import { Badge } from "@/components/core/badge"
import type { BorrowingDto } from "@/features/borrowings/types"

function statusOf(b: BorrowingDto): "Active" | "Overdue" | "Returned" {
  if (b.returnedAt) return "Returned"
  if (b.isOverdue || new Date(b.dueAt) < new Date()) return "Overdue"
  return "Active"
}

export default function MyBorrowingsPage() {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useQuery({
    queryKey: ["borrowings", "mine", { page, pageSize }],
    queryFn: () => listMyBorrowings({ page, pageSize }),
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">My borrowings</h1>

      <DataTable<BorrowingDto>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyText="You haven't borrowed anything yet."
        columns={[
          { header: "Tx ID", cell: (b) => <span className="font-mono text-xs">{b.id.slice(0, 8)}</span> },
          { header: "Book", cell: (b) => b.bookTitle },
          { header: "Borrowed", cell: (b) => new Date(b.borrowedAt).toLocaleDateString() },
          { header: "Due", cell: (b) => new Date(b.dueAt).toLocaleDateString() },
          {
            header: "Status",
            cell: (b) => {
              const s = statusOf(b)
              return (
                <Badge variant={s === "Overdue" ? "destructive" : s === "Returned" ? "secondary" : "default"}>
                  {s}
                </Badge>
              )
            },
          },
          { header: "Fine", cell: (b) => (b.fineAmount > 0 ? `$${b.fineAmount.toFixed(2)}` : "—") },
          { header: "Reward credit", cell: (b) => (b.rewardCredit > 0 ? b.rewardCredit : "—") },
        ]}
      />

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}
    </div>
  )
}
