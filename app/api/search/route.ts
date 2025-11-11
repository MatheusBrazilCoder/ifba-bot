import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()

  if (!query) {
    // Return all questions if no query
    return NextResponse.json(data.questions.slice(0, 5))
  }

  // Search in questions
  const results = data.questions.filter(
    (q: any) => q.question.toLowerCase().includes(query) || (q.body && q.body.toLowerCase().includes(query)),
  )

  return NextResponse.json(results.slice(0, 10))
}
