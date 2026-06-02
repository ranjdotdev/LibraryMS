import { z } from "zod"

const roleEnum = z.enum(["Admin", "Member"], { message: "Pick a role" })

export const createUserSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: roleEnum,
})

export const updateUserSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  role: roleEnum,
})
