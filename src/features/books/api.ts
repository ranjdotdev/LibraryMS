import { api } from "@/api/client"
import type { BookDto, BookQuery, CreateBookInput, UpdateBookInput } from "./types"
import type { PagedList } from "@/lib/types"

export const listBooks = (q: BookQuery) =>
  api.get<PagedList<BookDto>>("/api/books", { params: q }).then(r => r.data)

export const getBook = (id: string) =>
  api.get<BookDto>(`/api/books/${id}`).then(r => r.data)

export const createBook = (input: CreateBookInput) =>
  api.post<BookDto>("/api/books", input).then(r => r.data)

export const updateBook = (id: string, input: UpdateBookInput) =>
  api.put<BookDto>(`/api/books/${id}`, input).then(r => r.data)

export const deleteBook = (id: string) =>
  api.delete(`/api/books/${id}`).then(r => r.data)
