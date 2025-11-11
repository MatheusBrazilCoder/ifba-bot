import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const status = searchParams.get("status")
  const query = searchParams.get("q")

  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()
  let questions = data.questions

  // Filter by category
  if (category && category !== "all") {
    questions = questions.filter((q: any) => q.category === category)
  }

  // Filter by status
  if (status && status !== "all") {
    questions = questions.filter((q: any) => q.status === status)
  }

  // Search query
  if (query) {
    const lowerQuery = query.toLowerCase()
    questions = questions.filter(
      (q: any) =>
        q.question.toLowerCase().includes(lowerQuery) || (q.body && q.body.toLowerCase().includes(lowerQuery)),
    )
  }

  return NextResponse.json(questions)
}

export async function POST(request: Request) {
  const body = await request.json()

  // In a real app, this would save to a database
  // For now, we just return the created question
  const newQuestion = {
    id: Date.now(),
    question: body.question,
    body: body.body,
    category: body.category,
    views: 0,
    createdAt: new Date().toISOString().split("T")[0],
    status: "unanswered",
    answerCount: 0,
  }

  return NextResponse.json(newQuestion, { status: 201 })
}
