import { Button } from "@/components/core/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowLeftDoubleIcon,
  ArrowRightDoubleIcon,
} from "@hugeicons/core-free-icons"

type Props = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-1">
      {page > 2 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          aria-label="First page"
        >
          <HugeiconsIcon icon={ArrowLeftDoubleIcon} className="size-4" />
        </Button>
      )}

      {page > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        </Button>
      )}

      <span className="text-sm text-muted-foreground px-3">
        Page {page} of {totalPages}
      </span>

      {page < totalPages && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Button>
      )}

      {page < totalPages - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          aria-label="Last page"
        >
          <HugeiconsIcon icon={ArrowRightDoubleIcon} className="size-4" />
        </Button>
      )}
    </div>
  )
}
