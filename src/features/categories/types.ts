import type { z } from "zod"
import type { createCategorySchema } from "./schemas"

export type CategoryDto = {
  id: string
  name: string
  bookCount: number
}

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = CreateCategoryInput
