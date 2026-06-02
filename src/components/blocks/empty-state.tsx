import { HugeiconsIcon } from "@hugeicons/react"
import { QuestionIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/core/button"

export type EmptyStateProps = {
  icon?: typeof QuestionIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-16 text-center space-y-4 animate-fade-in">
      {icon && (
        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-muted/60">
          <HugeiconsIcon icon={icon} className="size-7 text-muted-foreground/60" />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-medium text-sm text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
