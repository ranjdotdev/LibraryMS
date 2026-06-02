import { useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/core/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/core/dropdown-menu"
import { ThemeToggle } from "@/components/blocks/theme-toggle"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Book01Icon,
  Bookmark01Icon,
  Folder01Icon,
  Logout01Icon,
  LibraryIcon,
  UserMultipleIcon,
  PackageIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons"

type NavItem = {
  to: string
  label: string
  icon: typeof Book01Icon
}

const memberLinks: NavItem[] = [
  { to: "/books", label: "Books", icon: Book01Icon },
  { to: "/categories", label: "Categories", icon: Folder01Icon },
  { to: "/my-borrowings", label: "My borrowings", icon: Bookmark01Icon },
]

const adminLinks: NavItem[] = [
  { to: "/admin/books", label: "Books", icon: Book01Icon },
  { to: "/admin/categories", label: "Categories", icon: Folder01Icon },
  { to: "/admin/users", label: "Users", icon: UserMultipleIcon },
  { to: "/admin/borrowings", label: "Borrowings", icon: PackageIcon },
]

export function AuthenticatedLayout() {
  const { user, isAdmin, logout } = useAuth()
  const [adminMode, setAdminMode] = useState(false)

  const links = isAdmin && adminMode ? adminLinks : memberLinks

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 z-30 bg-background/80 backdrop-blur">
        <div className="container mx-auto grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 px-4">
          <NavLink
            to={adminMode ? "/admin/books" : "/books"}
            className="flex items-center gap-2 font-semibold justify-self-start"
          >
            <HugeiconsIcon icon={LibraryIcon} className="size-5" />
            <span>
              LibraryMS
              {adminMode && <span className="ms-1 text-muted-foreground font-normal">· Admin</span>}
            </span>
          </NavLink>

          <nav className="flex items-center gap-1 justify-self-center">
            {links.map((l) => (
              <NavItemLink key={l.to} {...l} />
            ))}
          </nav>

          <div className="flex items-center gap-1 justify-self-end">
            {isAdmin && (
              <Button
                variant={adminMode ? "default" : "outline"}
                size="sm"
                onClick={() => setAdminMode((v) => !v)}
                className="gap-2"
              >
                <HugeiconsIcon icon={UserSwitchIcon} className="size-4" />
                <span>{adminMode ? "Member view" : "Admin view"}</span>
              </Button>
            )}

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <span className="text-sm">{user?.fullName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{user?.fullName}</span>
                  <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                  <span className="text-xs text-muted-foreground font-normal mt-1">{user?.role}</span>
                  {typeof user?.totalCredit === "number" && (
                    <span className="text-xs text-muted-foreground font-normal">
                      Reward credit: {user.totalCredit}
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                  <HugeiconsIcon icon={Logout01Icon} className="size-4 me-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-1">
        <Outlet />
      </main>
    </div>
  )
}

function NavItemLink({ to, label, icon }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition-colors",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        ].join(" ")
      }
    >
      <HugeiconsIcon icon={icon} className="size-4" />
      <span>{label}</span>
    </NavLink>
  )
}
