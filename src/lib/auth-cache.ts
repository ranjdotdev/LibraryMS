import type { AuthUser } from "@/features/auth/types"

const KEY = "libms.user"

export function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function writeCachedUser(user: AuthUser | null) {
  if (user) localStorage.setItem(KEY, JSON.stringify(user))
  else localStorage.removeItem(KEY)
}
