import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTitle } from "@/components/core/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/core/form"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { BookPicker } from "@/features/books/components/book-picker"
import { UserPicker } from "@/features/users/components/user-picker"
import { ApiError } from "@/api/client"
import { issueBorrowing } from "../api"
import { issueBorrowingSchema } from "../schemas"
import type { IssueBorrowingInput } from "../types"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IssueBorrowingDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const form = useForm<IssueBorrowingInput>({
    resolver: zodResolver(issueBorrowingSchema),
    defaultValues: { bookId: "", userId: "", dueDays: 14 },
  })

  const mutation = useMutation({
    mutationFn: issueBorrowing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["borrowings"] })
      queryClient.invalidateQueries({ queryKey: ["books"] })
      onOpenChange(false)
      form.reset()
      toast.success("Book issued.")
    },
    onError: (err: ApiError) => {
      if (err.status === 409) {
        toast.error("Someone just took the last copy. Refreshing availability.")
        queryClient.invalidateQueries({ queryKey: ["books"] })
      } else {
        toast.error(err.message)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Issue book</DialogTitle>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutateAsync(values))}
            noValidate
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="bookId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book</FormLabel>
                  <FormControl>
                    <BookPicker value={field.value} onChange={field.onChange} availableOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <UserPicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due in (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      name={field.name}
                      ref={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Issuing…" : "Issue"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
