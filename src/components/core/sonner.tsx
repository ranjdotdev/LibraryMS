import { Toaster as Sonner, type ToasterProps } from "sonner"
import { useTheme } from "@/providers/theme-provider"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedMode } = useTheme()

  return (
    <Sonner
      theme={resolvedMode}
      className="toaster group"
      toastOptions={{
        className: "backdrop-blur-md bg-background/60 border-black/5 dark:border-white/10",
      }}
      style={
        {
          "--normal-bg": "transparent",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "transparent",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
