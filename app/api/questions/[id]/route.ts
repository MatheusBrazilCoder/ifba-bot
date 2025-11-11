import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()

  const question = data.questions.find((q: any) => q.id === Number.parseInt(params.id))

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }

  return NextResponse.json(question)
}
