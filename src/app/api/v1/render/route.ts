import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { getValidNumber } from "@aitube/clap"

import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"
import { getContentType } from "@/lib/data/getContentType"

// import { render } from "./animatediff-lcm-svd"
import { render } from "./animatediff-lightning"

export async function POST(req: NextRequest, res: NextResponse) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const request = await req.json() as {
    prompt: string
    width: number
    height: number
    turbo: boolean
    // can add more stuff for the V2 of Stories Factory
  }
  
  console.log("[api/v1/render] request:", request)

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query
  
  const turbo = !!query?.turbo

  const prompt = `${request?.prompt || ""}`.trim()
  const width = getValidNumber(request?.width, 256, 8192, 1024)
  const height = getValidNumber(request?.height, 256, 8192, 576)
  const nbFrames = 80 // I think we are capped to 70? that would explain the 2.9166 (70/24)
  const nbFPS = 24
  const nbSteps = turbo ? 4 : 8
  const debug = true

  const assetUrl = await render({
    prompt,
    width,
    height,
    nbFrames,
    nbFPS,
    nbSteps,
    debug,
  })

  const contentType = getContentType(assetUrl)
  const base64String = assetUrl.split(";base64,").pop() || ""
  const data = Buffer.from(base64String, "base64")
  const headers = new Headers()
  headers.set('Content-Type', contentType)
  return new NextResponse(data, {
    status: 200,
    statusText: "OK",
    headers
  })
}