import { Link } from "react-router-dom"
import { Button } from "@/components/core/button"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">403 · Forbidden</h1>
      <p className="text-muted-foreground">You don't have access to that page.</p>
      <Button asChild>
        <Link to="/books">Back to books</Link>
      </Button>
    </div>
  )
}
