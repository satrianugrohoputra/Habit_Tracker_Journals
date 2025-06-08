"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Automatically redirect to main page instead of showing error
    window.location.href = "/"
  }, [])

  return null
}
