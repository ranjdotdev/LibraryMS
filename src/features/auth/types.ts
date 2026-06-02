export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: "Admin" | "Member"
  totalCredit: number
}

export type LoginInput = { email: string; password: string }
export type RegisterInput = { fullName: string; email: string; password: string }
