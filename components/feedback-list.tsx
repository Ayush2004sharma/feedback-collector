"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface Feedback {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
}

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback")

        if (!response.ok) {
          throw new Error("Failed to fetch feedback")
        }

        const data = await response.json()
        setFeedbacks(data)
      } catch (error) {
        setError("Failed to load feedback. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>
  }

  if (feedbacks.length === 0) {
    return <div className="text-center py-8">No feedback submitted yet.</div>
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">{feedback.name}</CardTitle>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{feedback.email}</p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{feedback.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

