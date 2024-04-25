import { NextResponse, NextRequest } from "next/server"

import { serializeClap } from "@/lib/clap/serializeClap"
import { parseClap } from "@/lib/clap/parseClap"
import { startOfSegment1IsWithinSegment2 } from "@/lib/utils/startOfSegment1IsWithinSegment2"
import { getVideoPrompt } from "@/components/interface/latent-engine/core/prompts/getVideoPrompt"
import { newSegment } from "@/lib/clap/newSegment"
import { generateImage } from "@/components/interface/latent-engine/resolvers/image/generateImage"
import { getToken } from "@/app/api/auth/getToken"

// a helper to generate storyboards for a Clap
// this is mostly used by external apps such as the Stories Factory
// this function will:
//
// - add missing storyboards to the shots
// - add missing storyboard prompts
// - add missing storyboard images
export async function POST(req: NextRequest) {

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()
  const clap = await parseClap(blob)

  if (!clap.segments) { throw new Error(`no segment found in the provided clap!`) }

  const shotsSegments = clap.segments.filter(s => s.category === "camera")

  if (shotsSegments.length > 32) {
    throw new Error(`Error, this endpoint being synchronous, it is designed for short stories only (max 32 shots).`)
  }

  for (const shotSegment of shotsSegments) {

    const shotSegments = clap.segments.filter(s =>
      startOfSegment1IsWithinSegment2(s, shotSegment)
    )

    const shotStoryboardSegments = shotSegments.filter(s =>
      s.category === "storyboard"
    )

    let shotStoryboardSegment = shotStoryboardSegments.at(0)

    // TASK 1: GENERATE MISSING STORYBOARD SEGMENT
    if (!shotStoryboardSegment) {
      shotStoryboardSegment = newSegment({
        track: 1,
        startTimeInMs: shotSegment.startTimeInMs,
        endTimeInMs: shotSegment.endTimeInMs,
        assetDurationInMs: shotSegment.assetDurationInMs,
        category: "storyboard",
        prompt: "",
        assetUrl: "",
        outputType: "image"
      })
    }

    // TASK 2: GENERATE MISSING STORYBOARD PROMPT
    if (!shotStoryboardSegment.prompt) {
      // storyboard is missing, let's generate it
      shotStoryboardSegment.prompt = getVideoPrompt(shotSegments, {}, [])
    }

    // TASK 3: GENERATE MISSING STORYBOARD BITMAP
    if (!shotStoryboardSegment.assetUrl) {
      // note this will do a fetch to AiTube API
      // which is a bit weird since we are already inside the API, but it works
      //TODO Julian: maybe we could use an internal function call instead?
      shotStoryboardSegment.assetUrl = await generateImage({
        prompt: shotStoryboardSegment.prompt,
         width: clap.meta.width,
        height: clap.meta.height,
        token: jwtToken,
      })
    }
  }
  // TODO: generate the storyboards for the clap 

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}