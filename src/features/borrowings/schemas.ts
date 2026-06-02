import { z } from "zod"

export const issueBorrowingSchema = z.object({
  bookId: z.guid("Pick a book"),
  userId: z.guid("Pick a user"),
  dueDays: z.coerce.number().int().min(1, "At least 1 day").max(120, "At most 120 days"),
})
