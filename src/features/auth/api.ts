import { api } from "@/api/client"
import type { AuthUser, LoginInput, RegisterInput } from "./types"

export const login = (input: LoginInput) =>
  api.post<AuthUser>("/api/auth/login", input).then((r) => r.data)

export const register = (input: RegisterInput) =>
  api.post<AuthUser>("/api/auth/register", input).then((r) => r.data)

export const getCurrentUser = () =>
  api.get<AuthUser>("/api/auth/me").then((r) => r.data)

export const logout = () => api.post("/api/auth/logout").then(() => undefined)
