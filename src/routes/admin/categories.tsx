import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/api/client"
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/features/categories/api"
import type { CategoryDto, CreateCategoryInput } from "@/features/categories/types"
import { CategoryForm } from "@/features/categories/components/category-form"
import { DataTable } from "@/components/blocks/data-table"
import { ConfirmDialog } from "@/components/blocks/confirm-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/core/dialog"
import { Button } from "@/components/core/button"

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<CategoryDto | null>(null)
  const [deleting, setDeleting] = useState<CategoryDto | null>(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", "list"],
    queryFn: listCategories,
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setCreating(false)
      toast.success("Category created.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: (input: CreateCategoryInput & { id: string }) =>
      updateCategory(input.id, { name: input.name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      setEditing(null)
      toast.success("Category updated.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setDeleting(null)
      toast.success("Category deleted.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Categories</h1>
        <Button onClick={() => setCreating(true)}>+ New category</Button>
      </div>

      <DataTable<CategoryDto>
        loading={isLoading}
        rows={categories}
        emptyText="No categories yet."
        columns={[
          { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { header: "Books", cell: (c) => c.bookCount },
          {
            header: "",
            cell: (c) => (
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setEditing(c)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(c)}>Delete</Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogTitle>New category</DialogTitle>
          <CategoryForm
            onSubmit={async (v) => {
              await createMutation.mutateAsync(v)
            }}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogTitle>Edit category</DialogTitle>
          {editing && (
            <CategoryForm
              defaultValues={{ name: editing.name }}
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
        title="Delete category?"
        description={deleting ? `"${deleting.name}" will be removed.` : undefined}
        confirmLabel="Delete"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  )
}
