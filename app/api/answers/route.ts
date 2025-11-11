import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const questionId = searchParams.get("questionId")

  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()

  let answers = data.answers

  // Filter by question ID
  if (questionId) {
    answers = answers.filter((a: any) => a.questionId === Number.parseInt(questionId))
  }

  return NextResponse.json(answers)
}

export async function POST(request: Request) {
  const body = await request.json()

  const newAnswer = {
    id: Date.now(),
    questionId: body.questionId,
    content: body.content,
    userName: body.userName || "Usuário Anônimo",
    userStatus: body.userStatus || "Aluno",
    createdAt: new Date().toISOString().split("T")[0],
  }

  return NextResponse.json(newAnswer, { status: 201 })
}
