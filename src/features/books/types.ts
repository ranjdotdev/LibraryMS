import type { z } from "zod"
import type { createBookSchema } from "./schemas"

export type BookDto = {
  id: string
  title: string
  author: string
  categoryId: string
  categoryName: string
  totalCopies: number
  availableCopies: number
  isAvailable: boolean
  createdAt: string
}

export type BookQuery = {
  search?: string
  categoryId?: string
  available?: boolean
  page: number
  pageSize: number
}

export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = CreateBookInput
