
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { readCachedUser, writeCachedUser } from "@/lib/auth-cache"
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getCurrentUser,
} from "@/features/auth/api"
import type { AuthUser, LoginInput, RegisterInput } from "@/features/auth/types"

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [user, setUser] = useState<AuthUser | null>(() => readCachedUser())

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: user !== null,
    retry: false,
    staleTime: 15 * 60 * 1000,
  })

  useEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data)
      writeCachedUser(meQuery.data)
    }
  }, [meQuery.data])


  useEffect(() => {
    function onForcedLogout() {
      setUser(null)
      writeCachedUser(null)
      queryClient.clear()
      navigate("/login", { replace: true })
    }
    window.addEventListener("auth:logout", onForcedLogout)
    return () => window.removeEventListener("auth:logout", onForcedLogout)
  }, [queryClient, navigate])

  async function login(input: LoginInput) {
    const res = await loginApi(input)
    writeCachedUser(res)
    setUser(res)
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
  }

  async function register(input: RegisterInput) {
    const res = await registerApi(input)
    writeCachedUser(res)
    setUser(res)
    await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
  }

  async function logout() {
    try {
      await logoutApi()
    } finally {
      writeCachedUser(null)
      setUser(null)
      queryClient.clear()
      navigate("/login", { replace: true })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: meQuery.isLoading,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "Admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
