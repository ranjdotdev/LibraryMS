import type { z } from "zod"
import type { createUserSchema, updateUserSchema } from "./schemas"

export type UserDto = {
  id: string
  fullName: string
  email: string
  role: "Admin" | "Member"
  createdAt: string
  totalCredit: number
}

export type UserQuery = {
  search?: string
  role?: "Admin" | "Member"
  page: number
  pageSize: number
}

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
