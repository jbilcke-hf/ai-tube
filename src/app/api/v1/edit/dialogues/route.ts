import { NextResponse, NextRequest } from "next/server"

import { ClapProject, ClapSegment, newClap, parseClap, serializeClap } from "@aitube/clap"


import { processShot } from "./processShot"
import queryString from "query-string"
import { parseCompletionMode } from "@/app/api/parsers/parseCompletionMode"
import { throwIfInvalidToken } from "@/app/api/v1/auth/throwIfInvalidToken"
import { ClapCompletionMode } from "@aitube/client"
import { parseTurbo } from "@/app/api/parsers/parseTurbo"

// a helper to generate speech for a Clap
export async function POST(req: NextRequest) {
  await throwIfInvalidToken(req.headers.get("Authorization"))

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query
  
  const mode = parseCompletionMode(query?.c)
  const turbo = parseTurbo(query?.t)
  
  const blob = await req.blob()

  const existingClap: ClapProject = await parseClap(blob)

  if (!existingClap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  console.log(`[api/edit/dialogues] detected ${existingClap.segments.length} segments`)
  
  const shotsSegments: ClapSegment[] = existingClap.segments.filter(s => s.category === "camera")
  console.log(`[api/edit/dialogues] detected ${shotsSegments.length} shots`)
  
  if (shotsSegments.length > 32) {
    throw new Error(`Error, this endpoint being synchronous, it is designed for short stories only (max 32 shots).`)
  }

  const newerClap = mode === ClapCompletionMode.FULL ? existingClap : newClap()
  
  // we process the shots in parallel (this will increase the queue size in the Gradio spaces)
  await Promise.all(shotsSegments.map(shotSegment =>
    processShot({
      shotSegment,
      existingClap,
      newerClap,
      mode,
      turbo,
    })
  ))

  // console.log(`[api/edit/dialogues] returning the clap augmented with dialogues`)

  return new NextResponse(await serializeClap(newerClap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
