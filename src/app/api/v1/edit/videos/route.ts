import { NextResponse, NextRequest } from "next/server"

import { ClapProject, ClapSegment, parseClap, serializeClap } from "@aitube/clap"

import { getToken } from "@/app/api/auth/getToken"

import { processShot } from "./processShot"


// a helper to generate videos for a Clap
// this is mostly used by external apps such as the Stories Factory
// this function will:
//
// - add missing videos to the shots
// - add missing video prompts
// - add missing video files
export async function POST(req: NextRequest) {

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const clap: ClapProject = await parseClap(blob)

  if (!clap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  console.log(`[api/edit/videos] detected ${clap.segments.length} segments`)
  
  const shotsSegments: ClapSegment[] = clap.segments.filter(s => s.category === "camera")
  console.log(`[api/edit/videos] detected ${shotsSegments.length} shots`)
  
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

  console.log(`[api/edit/videos] returning the clap augmented with videos`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
