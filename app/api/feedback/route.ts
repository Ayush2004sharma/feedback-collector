import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Path to our "database" file
const dataFilePath = path.join(process.cwd(), "data", "feedback.json")

// Ensure the data directory exists
const ensureDataDirectoryExists = () => {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), "utf8")
  }
}

// Read feedback data
const getFeedbackData = () => {
  ensureDataDirectoryExists()

  try {
    const data = fs.readFileSync(dataFilePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading feedback data:", error)
    return []
  }
}

// Write feedback data
const writeFeedbackData = (data: any[]) => {
  ensureDataDirectoryExists()

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8")
    return true
  } catch (error) {
    console.error("Error writing feedback data:", error)
    return false
  }
}

// GET handler
export async function GET() {
  const feedbacks = getFeedbackData()
  return NextResponse.json(feedbacks)
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // Create new feedback entry
    const newFeedback = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      message: body.message,
      timestamp: new Date().toISOString(),
    }

    // Get existing feedback and add the new one
    const feedbacks = getFeedbackData()
    feedbacks.unshift(newFeedback) // Add to the beginning of the array

    // Save updated feedback data
    const success = writeFeedbackData(feedbacks)

    if (!success) {
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 })
    }

    return NextResponse.json(newFeedback, { status: 201 })
  } catch (error) {
    console.error("Error processing feedback submission:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

