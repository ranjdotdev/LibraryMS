import type { z } from "zod"
import type { issueBorrowingSchema } from "./schemas"

export type BorrowingDto = {
  id: string
  bookId: string
  bookTitle: string
  userId: string
  userFullName: string
  borrowedAt: string
  dueAt: string
  returnedAt: string | null
  isOverdue: boolean
  fineAmount: number
  rewardCredit: number
}

export type BorrowingQuery = {
  page: number
  pageSize: number
}

export type IssueBorrowingInput = z.infer<typeof issueBorrowingSchema>
