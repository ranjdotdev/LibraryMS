import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/providers/auth-provider"

export function AdminRoute() {
  const { isAdmin } = useAuth()
  return isAdmin ? <Outlet /> : <Navigate to="/403" replace />
}
