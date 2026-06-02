import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"
import { ApiError } from "@/api/client"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/core/form"
import { Input } from "@/components/core/input"
import { Button } from "@/components/core/button"
import { Card } from "@/components/core/card"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/books"

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginValues) {
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Log in</h1>
          <p className="text-sm text-muted-foreground">Welcome back to LibraryMS.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Logging in…" : "Log in"}
            </Button>
          </form>
        </Form>

        <p className="text-sm text-center text-muted-foreground">
          No account?{" "}
          <Link to="/register" className="underline text-foreground">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}
