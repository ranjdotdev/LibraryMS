import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ApiError } from "@/api/client"
import { useDebouncedValue } from "@/hooks/use-debounce"
import { createUser, deleteUser, listUsers, updateUser } from "@/features/users/api"
import type { CreateUserInput, UpdateUserInput, UserDto } from "@/features/users/types"
import { UserForm } from "@/features/users/components/user-form"
import { DataTable } from "@/components/blocks/data-table"
import { Pagination } from "@/components/blocks/pagination"
import { ConfirmDialog } from "@/components/blocks/confirm-dialog"
import { Dialog, DialogContent, DialogTitle } from "@/components/core/dialog"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { Badge } from "@/components/core/badge"

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const filters = { page, pageSize, search: debouncedSearch || undefined }

  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<UserDto | null>(null)
  const [deleting, setDeleting] = useState<UserDto | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["users", "list", filters],
    queryFn: () => listUsers(filters),
  })

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setCreating(false)
      toast.success("User created.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const updateMutation = useMutation({
    mutationFn: (input: UpdateUserInput & { id: string }) =>
      updateUser(input.id, { fullName: input.fullName, email: input.email, role: input.role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setEditing(null)
      toast.success("User updated.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      setDeleting(null)
      toast.success("User deleted.")
    },
    onError: (e: ApiError) => toast.error(e.message),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Users</h1>
        <Button onClick={() => setCreating(true)}>+ New user</Button>
      </div>

      <Input
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="max-w-xs"
      />

      <DataTable<UserDto>
        loading={isLoading}
        rows={data?.items ?? []}
        emptyText="No users."
        columns={[
          { header: "Name", cell: (u) => <span className="font-medium">{u.fullName}</span> },
          { header: "Email", cell: (u) => u.email },
          {
            header: "Role",
            cell: (u) => (
              <Badge variant={u.role === "Admin" ? "default" : "secondary"}>{u.role}</Badge>
            ),
          },
          { header: "Reward credit", cell: (u) => u.totalCredit },
          {
            header: "",
            cell: (u) => (
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => setEditing(u)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(u)}>Delete</Button>
              </div>
            ),
          },
        ]}
      />

      {data && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogTitle>New user</DialogTitle>
          <UserForm
            mode="create"
            onSubmit={(values: CreateUserInput) => createMutation.mutateAsync(values)}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogTitle>Edit user</DialogTitle>
          {editing && (
            <UserForm
              mode="update"
              defaultValues={{
                fullName: editing.fullName,
                email: editing.email,
                role: editing.role,
              }}
              onSubmit={(values) =>
                updateMutation.mutateAsync({ id: editing.id, ...values })
              }
              isPending={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete user?"
        description={deleting ? `${deleting.fullName} (${deleting.email}) will be removed.` : undefined}
        confirmLabel="Delete"
        destructive
        isPending={deleteMutation.isPending}
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
      />
    </div>
  )
}
