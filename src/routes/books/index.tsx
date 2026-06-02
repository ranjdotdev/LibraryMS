import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { listBooks } from "@/features/books/api"
import { useDebouncedValue } from "@/hooks/use-debounce"
import { CategoryPicker } from "@/features/categories/components/category-picker"
import { DataTable } from "@/components/blocks/data-table"
import { Pagination } from "@/components/blocks/pagination"
import { Input } from "@/components/core/input"
import { Badge } from "@/components/core/badge"
import { Button } from "@/components/core/button"

export default function BooksListPage() {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const debouncedSearch = useDebouncedValue(search, 350)

  const filters = {
    page,
    pageSize,
    search: debouncedSearch || undefined,
    categoryId,
  }
  const { data, isLoading } = useQuery({
    queryKey: ["books", "list", filters],
    queryFn: () => listBooks(filters),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Books</h1>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="max-w-xs"
        />
        <div className="w-56">
          <CategoryPicker
            value={categoryId ?? ""}
            onChange={(id) => {
              setCategoryId(id || undefined)
              setPage(1)
            }}
            placeholder="All categories"
            allowClear
          />
        </div>
        {(search || categoryId) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("")
              setCategoryId(undefined)
              setPage(1)
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <DataTable
        loading={isLoading}
        rows={data?.items ?? []}
        emptyText="No books match your filters."
        columns={[
          {
            header: "Title",
            cell: (b) => (
              <Link to={`/books/${b.id}`} className="font-medium hover:underline">
                {b.title}
              </Link>
            ),
          },
          { header: "Author", cell: (b) => b.author },
          { header: "Category", cell: (b) => b.categoryName },
          {
            header: "Availability",
            cell: (b) =>
              b.isAvailable ? (
                <Badge variant="default">Available ({b.availableCopies})</Badge>
              ) : (
                <Badge variant="destructive">Out</Badge>
              ),
          },
        ]}
      />

      {data && (
        <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
      )}
    </div>
  )
}
