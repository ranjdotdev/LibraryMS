import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { createCategorySchema } from "../schemas"
import type { CreateCategoryInput } from "../types"

type Props = {
  defaultValues?: Partial<CreateCategoryInput>
  onSubmit: (values: CreateCategoryInput) => Promise<void> | void
  isPending?: boolean
}

export function CategoryForm({ defaultValues, onSubmit, isPending }: Props) {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: defaultValues?.name ?? "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  )
}
