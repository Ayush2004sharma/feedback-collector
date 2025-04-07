"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Moon, Sun } from "lucide-react"
import FeedbackForm from "@/components/feedback-form"
import FeedbackList from "@/components/feedback-list"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("submit")

  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Feedback Collector</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <CardContent className="p-6">
            <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
                <TabsTrigger value="admin">View Submitted Feedback</TabsTrigger>
              </TabsList>
              <TabsContent value="submit">
                <FeedbackForm onSuccess={() => setActiveTab("admin")} />
              </TabsContent>
              <TabsContent value="admin">
                <FeedbackList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <footer className="py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Feedback Collector - Created by John Doe
        </div>
      </footer>
    </main>
  )
}

