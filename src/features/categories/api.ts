import { api } from "@/api/client"
import type { CategoryDto, CreateCategoryInput, UpdateCategoryInput } from "./types"

export const listCategories = () =>
  api.get<CategoryDto[]>("/api/categories").then((r) => r.data)

export const createCategory = (input: CreateCategoryInput) =>
  api.post<CategoryDto>("/api/categories", input).then((r) => r.data)

export const updateCategory = (id: string, input: UpdateCategoryInput) =>
  api.put<CategoryDto>(`/api/categories/${id}`, input).then((r) => r.data)

export const deleteCategory = (id: string) =>
  api.delete(`/api/categories/${id}`).then((r) => r.data)
