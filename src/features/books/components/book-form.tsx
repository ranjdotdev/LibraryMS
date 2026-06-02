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
import { CategoryPicker } from "@/features/categories/components/category-picker"
import { createBookSchema, type CreateBookInput } from "../schemas"

type Props = {
  defaultValues?: Partial<CreateBookInput>
  onSubmit: (values: CreateBookInput) => Promise<void> | void
  isPending?: boolean
}

export function BookForm({ defaultValues, onSubmit, isPending }: Props) {
  const form = useForm<CreateBookInput>({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      author: defaultValues?.author ?? "",
      categoryId: defaultValues?.categoryId ?? "",
      totalCopies: defaultValues?.totalCopies ?? 1,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryPicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalCopies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total copies</FormLabel>
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}
