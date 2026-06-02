
import { z } from "zod"

const schema = {
  VITE_API_URL: z.string().url(),
}

type Schema = typeof schema
type Env = { [K in keyof Schema]: z.infer<Schema[K]> }

function parseEnv(): Env {
  if (import.meta.env.VITE_SKIP_ENV_VALIDATION === "true") {
    return import.meta.env as unknown as Env
  }

  const raw: Record<string, string | undefined> = {}
  for (const key of Object.keys(schema)) {
    const value = import.meta.env[key]
    raw[key] = value === "" ? undefined : value
  }

  const result = z.object(schema).safeParse(raw)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    const lines = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n")

    throw new Error(`Invalid environment variables:\n${lines}`)
  }

  return Object.freeze(result.data) as Env
}

export const env = parseEnv()

export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const mode = import.meta.env.MODE

declare global {
  interface ImportMetaEnv extends Env {
    readonly VITE_SKIP_ENV_VALIDATION?: string
  }
}
