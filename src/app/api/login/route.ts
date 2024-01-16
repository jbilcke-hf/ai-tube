import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  console.log("Received GET /api/login:", req.url)
  return NextResponse.redirect("https://aitube.at")
}

export async function POST(req: NextRequest, res: NextResponse) {
  const data  = await req.json()
  console.log(data)
  console.log("Received POST /api/login:", req.url)
  return NextResponse.redirect("https://aitube.at")
}