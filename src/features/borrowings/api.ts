import { api } from "@/api/client"
import type { PagedList } from "@/lib/types"
import type { BorrowingDto, BorrowingQuery, IssueBorrowingInput } from "./types"

export const listBorrowings = (q: BorrowingQuery) =>
  api.get<PagedList<BorrowingDto>>("/api/borrowing", { params: q }).then((r) => r.data)

export const listMyBorrowings = (q: BorrowingQuery) =>
  api.get<PagedList<BorrowingDto>>("/api/borrowing/my", { params: q }).then((r) => r.data)

export const issueBorrowing = (input: IssueBorrowingInput) =>
  api.post<BorrowingDto>("/api/borrowing/issue", input).then((r) => r.data)

export const returnBorrowing = (id: string) =>
  api.put<BorrowingDto>(`/api/borrowing/${id}/return`).then((r) => r.data)

export const refreshOverdue = () =>
  api.post("/api/bj/refresh").then(() => undefined)
