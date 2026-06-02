import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useDebouncedValue } from "@/hooks/use-debounce"
import { ApiError } from "@/api/client"
import {
  createBook,
  deleteBook,
  listBooks,
  updateBook,
} from "@/features/books/api"
import type { BookDto, UpdateBookInput } from "@/features/books/types"
import { BookForm } from "@/features/books/components/book-form"
import { DataTable } from "@/components/blocks/data-table"
import { Pagination } from "@/components/blocks/pagination"
import { ConfirmDialog } from "@/components/blocks/confirm-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/core/dialog"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { Badge } from "@/components/core/badge"

export default function AdminBooksPage() {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const pageSize = 20
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const filters = { page, pageSize, search: debouncedSearch || undefined }

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<BookDto | null>(null)
  const [deleting, setDeleting] = useState<BookDto | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["books", "list", filters],
    queryFn: () => listBooks(filters),
  })

  const createMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      setCreating(false)
      toast.success("Book created.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateBookInput & { id: string }) =>
      updateBook(input.id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      setEditing(null)
      toast.success("Book updated.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] })
      setDeleting(null)
      toast.success("Book deleted.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Books</h1>
        <Button onClick={() => setCreating(true)}>+ New book</Button>
      </div>

      <Input
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="max-w-xs"
      />

      <DataTable<BookDto>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyText="No books yet."
        columns={[
          { header: "Title", cell: (b) => <span className="font-medium">{b.title}</span> },
          { header: "Author", cell: (b) => b.author },
          { header: "Category", cell: (b) => b.categoryName },
          {
            header: "Copies",
            cell: (b) => (
              <Badge variant={b.isAvailable ? "default" : "destructive"}>
                {b.availableCopies}/{b.totalCopies}
              </Badge>
            ),
          },
          {
            header: "",
            cell: (b) => (
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setEditing(b)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(b)}>Delete</Button>
              </div>
            ),
          },
        ]}
      />

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogTitle>New book</DialogTitle>
          <BookForm
            onSubmit={async (v) => {
              await createMutation.mutateAsync(v)
            }}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogTitle>Edit book</DialogTitle>
          {editing && (
            <BookForm
              defaultValues={{
                title: editing.title,
                author: editing.author,
                categoryId: editing.categoryId,
                totalCopies: editing.totalCopies,
              }}
              onSubmit={async (v) => {
                await updateMutation.mutateAsync({ id: editing.id, ...v })
              }}
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete book?"
        description={deleting ? `"${deleting.title}" will be removed.` : undefined}
        confirmLabel="Delete"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  )
}
