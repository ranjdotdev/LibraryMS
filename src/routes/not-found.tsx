import { Link } from "react-router-dom"
import { Button } from "@/components/core/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404 · Not Found</h1>
      <p className="text-muted-foreground">That page doesn't exist.</p>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}
