import { useQuery } from "@tanstack/react-query"
import { listCategories } from "@/features/categories/api"
import { Skeleton } from "@/components/core/skeleton"
import { Badge } from "@/components/core/badge"

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", "list"],
    queryFn: listCategories,
  })

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-center">Categories</h1>

      {isLoading ? (
        <ul className="divide-y rounded-md border">
          {(() => {
            const items: number[] = []
            for (let i = 0; i < 6; i++) items.push(i)
            return items.map((i) => (
              <li key={i} className="flex items-center justify-between px-4 py-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-12" />
              </li>
            ))
          })()}
        </ul>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">No categories yet.</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-accent/40 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              <Badge variant="secondary">{c.bookCount} books</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
