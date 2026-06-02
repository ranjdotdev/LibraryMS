import { z } from "zod"

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  author: z.string().min(1, "Author is required").max(100),
  categoryId: z.guid("Pick a category"),
  totalCopies: z.coerce.number().int().min(1, "At least 1 copy"),
})

export type CreateBookInput = z.infer<typeof createBookSchema>
