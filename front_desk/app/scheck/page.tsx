"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckInSuccess() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Get the previous URL from history or fallback to a default
    const previousUrl = document.referrer || "/"

    // Set up countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push(previousUrl)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Clean up timer on unmount
    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-blue-600 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-24 w-24" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Check-out Successful!</h1>
        <p className="mb-8 text-xl">The guest has been successfully checked out to their room.</p>
        <div className="rounded-lg bg-white/10 p-4">
          <p className="text-sm">
            Redirecting back in <span className="font-bold">{countdown}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  )
}
