import { Button } from "@/components/core/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/core/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sun03Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons"
import { useTheme } from "@/providers/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const icon =
    theme === "dark" ? Moon02Icon : theme === "system" ? ComputerIcon : Sun03Icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme">
          <HugeiconsIcon icon={icon} className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <HugeiconsIcon icon={Sun03Icon} className="size-4 me-2" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <HugeiconsIcon icon={Moon02Icon} className="size-4 me-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <HugeiconsIcon icon={ComputerIcon} className="size-4 me-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
