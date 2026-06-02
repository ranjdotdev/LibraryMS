import axios, { AxiosError } from "axios"
import { env } from "@/env"

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})


export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}


api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; detail?: string }>) => {
    const status = error.response?.status ?? 0
    const payload = error.response?.data
    const message =
      payload?.error ?? payload?.detail ?? error.message ?? "Network error"


    if (status === 401) {
      window.dispatchEvent(new Event("auth:logout"))
    }

    return Promise.reject(new ApiError(status, payload, message))
  },
)
