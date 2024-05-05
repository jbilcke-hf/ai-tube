import { NextResponse, NextRequest } from "next/server"
import { getValidNumber, serializeClap } from "@aitube/clap"

import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"

import { create } from "."

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function POST(req: NextRequest) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const request = await req.json() as {
    prompt: string
    width: number
    height: number
    // can add more stuff for the V2 of Stories Factory
  }
  
  console.log("[api/v1/create] request:", request)

  const clap = await create({
    prompt: `${request?.prompt || ""}`.trim(),
    width: getValidNumber(request?.width, 256, 8192, 1024),
    height: getValidNumber(request?.height, 256, 8192, 576)
  })

  // TODO replace by Clap file streaming
  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
