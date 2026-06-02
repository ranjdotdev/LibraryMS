import { Routes, Route, Navigate } from "react-router-dom"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { ProtectedRoute } from "@/components/blocks/protected-router"
import { AdminRoute } from "@/components/blocks/admin-route"

import LoginPage from "@/routes/login"
import RegisterPage from "@/routes/register"
import ForbiddenPage from "@/routes/forbidden"
import NotFoundPage from "@/routes/not-found"

import BooksListPage from "@/routes/books"
import BookDetailPage from "@/routes/books/detail"
import CategoriesPage from "@/routes/categories"
import MyBorrowingsPage from "@/routes/my-borrowings"

import AdminBooksPage from "@/routes/admin/books"
import AdminCategoriesPage from "@/routes/admin/categories"
import AdminUsersPage from "@/routes/admin/users"
import AdminBorrowingsPage from "@/routes/admin/borrowings"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/books" replace />} />

        <Route path="/books" element={<BooksListPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/my-borrowings" element={<MyBorrowingsPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin/books" element={<AdminBooksPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/borrowings" element={<AdminBorrowingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
