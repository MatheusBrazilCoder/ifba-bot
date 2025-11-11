import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  const response = await fetch(new URL("/mock-data.json", request.url))
  const data = await response.json()

  if (email) {
    const user = data.users.find((u: any) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(user)
  }

  return NextResponse.json(data.users)
}
