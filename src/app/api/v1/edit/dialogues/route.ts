import { NextResponse, NextRequest } from "next/server"

import { ClapProject, ClapSegment, parseClap, serializeClap } from "@aitube/clap"

import { getToken } from "@/app/api/auth/getToken"

import { processShot } from "./processShot"

// a helper to generate speech for a Clap
export async function POST(req: NextRequest) {

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const clap: ClapProject = await parseClap(blob)

  if (!clap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  console.log(`[api/edit/dialogues] detected ${clap.segments.length} segments`)
  
  const shotsSegments: ClapSegment[] = clap.segments.filter(s => s.category === "camera")
  console.log(`[api/edit/dialogues] detected ${shotsSegments.length} shots`)
  
  if (shotsSegments.length > 32) {
    throw new Error(`Error, this endpoint being synchronous, it is designed for short stories only (max 32 shots).`)
  }

  // we process the shots in parallel (this will increase the queue size in the Gradio spaces)
  await Promise.all(shotsSegments.map(shotSegment =>
    processShot({
      shotSegment,
      clap
    })
  ))

  // console.log(`[api/edit/dialogues] returning the clap augmented with dialogues`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
