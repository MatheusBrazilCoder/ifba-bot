import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()

  if (userId) {
    const history = data.searchHistory.filter((h: any) => h.userId === Number.parseInt(userId))
    return NextResponse.json(history)
  }

  return NextResponse.json(data.searchHistory)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  // In a real app, this would delete from the database
  // For now, we'll just return success
  return NextResponse.json({ success: true, deletedId: id })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, rating } = body

  // In a real app, this would update the database
  // For now, we'll just return the updated item
  return NextResponse.json({ success: true, id, rating })
}
