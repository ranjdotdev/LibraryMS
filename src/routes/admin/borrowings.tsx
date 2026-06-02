import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/api/client"
import { listBorrowings, refreshOverdue, returnBorrowing } from "@/features/borrowings/api"
import type { BorrowingDto } from "@/features/borrowings/types"
import { IssueBorrowingDialog } from "@/features/borrowings/components/issue-borrowing-dialog"
import { DataTable } from "@/components/blocks/data-table"
import { Pagination } from "@/components/blocks/pagination"
import { Button } from "@/components/core/button"
import { Badge } from "@/components/core/badge"

function statusOf(b: BorrowingDto): "Active" | "Overdue" | "Returned" {
  if (b.returnedAt) return "Returned"
  if (b.isOverdue || new Date(b.dueAt) < new Date()) return "Overdue"
  return "Active"
}

export default function AdminBorrowingsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [issuing, setIssuing] = useState(false)

  const refreshMutation = useMutation({
    mutationFn: refreshOverdue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowings"] })
      toast.success("Overdue refreshed.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const { data, isLoading } = useQuery({
    queryKey: ["borrowings", "list", { page, pageSize }],
    queryFn: () => listBorrowings({ page, pageSize }),
  })

  const returnMutation = useMutation({
    mutationFn: (id: string) => returnBorrowing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowings"] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      toast.success("Book returned.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Borrowings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refreshMutation.mutate()} disabled={refreshMutation.isPending}>
            {refreshMutation.isPending ? "Refreshing…" : "Refresh Overdues"}
          </Button>
          <Button onClick={() => setIssuing(true)}>+ Issue book</Button>
        </div>
      </div>

      <DataTable<BorrowingDto>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyText="No borrowings yet."
        columns={[
          { header: "Tx ID", cell: (b) => <span className="font-mono text-xs">{b.id.slice(0, 8)}</span> },
          { header: "Book", cell: (b) => b.bookTitle },
          { header: "User", cell: (b) => b.userFullName },
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
          {
            header: "",
            cell: (b) =>
              !b.returnedAt && (
                <Button
                  size="sm"
                  onClick={() => returnMutation.mutate(b.id)}
                  disabled={returnMutation.isPending}
                >
                  Return
                </Button>
              ),
          },
        ]}
      />

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}

      <IssueBorrowingDialog open={issuing} onOpenChange={setIssuing} />
    </div>
  )
}
