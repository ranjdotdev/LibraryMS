import { api } from "@/api/client"
import type { PagedList } from "@/lib/types"
import type { CreateUserInput, UpdateUserInput, UserDto, UserQuery } from "./types"

export const listUsers = (q: UserQuery) =>
  api.get<PagedList<UserDto>>("/api/users", { params: q }).then((r) => r.data)

export const createUser = (input: CreateUserInput) =>
  api.post<UserDto>("/api/users", input).then((r) => r.data)

export const updateUser = (id: string, input: UpdateUserInput) =>
  api.put<UserDto>(`/api/users/${id}`, input).then((r) => r.data)

export const deleteUser = (id: string) =>
  api.delete(`/api/users/${id}`).then((r) => r.data)
