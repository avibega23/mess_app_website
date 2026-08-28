import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (typeof error === "object" && error !== null && "response" in error) {
    const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message
    if (message) return message
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
