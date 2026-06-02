import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getBook } from "@/features/books/api"
import { Badge } from "@/components/core/badge"
import { Skeleton } from "@/components/core/skeleton"

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading } = useQuery({
    queryKey: ["books", "detail", id],
    queryFn: () => getBook(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-3">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    )
  }
  if (!book) return <p className="text-muted-foreground">Book not found.</p>

  return (
    <article className="max-w-2xl space-y-3">
      <h1 className="text-3xl font-semibold">{book.title}</h1>
      <p className="text-muted-foreground">by {book.author}</p>
      <Badge>{book.categoryName}</Badge>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <dt className="text-muted-foreground">Total copies</dt>
        <dd>{book.totalCopies}</dd>
        <dt className="text-muted-foreground">Available</dt>
        <dd>{book.availableCopies}</dd>
        <dt className="text-muted-foreground">Added</dt>
        <dd>{new Date(book.createdAt).toLocaleDateString()}</dd>
      </dl>
    </article>
  )
}
