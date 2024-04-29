import { NextResponse, NextRequest } from "next/server"

import { ClapProject, ClapSegment, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { startOfSegment1IsWithinSegment2 } from "@/lib/utils/startOfSegment1IsWithinSegment2"
import { getToken } from "@/app/api/auth/getToken"
import { getPositivePrompt } from "@/app/api/utils/imagePrompts"

import { generateVideo } from "./generateVideo"


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
  
  console.log(`[api/generate/videos] detected ${clap.segments.length} segments`)
  
  const shotsSegments: ClapSegment[] = clap.segments.filter(s => s.category === "camera")
  console.log(`[api/generate/videos] detected ${shotsSegments.length} shots`)
  
  if (shotsSegments.length > 32) {
    throw new Error(`Error, this endpoint being synchronous, it is designed for short stories only (max 32 shots).`)
  }

  for (const shotSegment of shotsSegments) {

    const shotSegments: ClapSegment[] = clap.segments.filter(s =>
      startOfSegment1IsWithinSegment2(s, shotSegment)
    )

    const shotVideoSegments: ClapSegment[] = shotSegments.filter(s =>
      s.category === "video"
    )

    let shotVideoSegment: ClapSegment | undefined = shotVideoSegments.at(0)
    
    console.log(`[api/generate/videos] shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotVideoSegments.length} videos)`)
  
    // TASK 1: GENERATE MISSING VIDEO SEGMENT
    if (!shotVideoSegment) {
      shotVideoSegment = newSegment({
        track: 1,
        startTimeInMs: shotSegment.startTimeInMs,
        endTimeInMs: shotSegment.endTimeInMs,
        assetDurationInMs: shotSegment.assetDurationInMs,
        category: "video",
        prompt: "",
        assetUrl: "",
        outputType: "video"
      })
      console.log(`[api/generate/videos] generated video segment [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}]`)
    }

    // TASK 2: GENERATE MISSING VIDEO PROMPT
    if (shotVideoSegment && !shotVideoSegment?.prompt) {
      // video is missing, let's generate it
      shotVideoSegment.prompt = getVideoPrompt(shotSegments, clap.entityIndex, ["high quality", "crisp", "detailed"])
      console.log(`[api/generate/videos] generating video prompt: ${shotVideoSegment.prompt}`)
    }

    // TASK 3: GENERATE MISSING VIDEO FILE
    if (shotVideoSegment && !shotVideoSegment.assetUrl) {
      console.log(`[api/generate/videos] generating video file..`)

      try {
        shotVideoSegment.assetUrl = await generateVideo({
          prompt: getPositivePrompt(shotVideoSegment.prompt),
          width: clap.meta.width,
          height: clap.meta.height,
        })
        shotVideoSegment.assetSourceType = getClapAssetSourceType(shotVideoSegment.assetUrl)
      } catch (err) {
        console.log(`[api/generate/videos] failed to generate a video file: ${err}`)
        throw err
      }
   
      console.log(`[api/generate/videos] generated video files: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)
    } else {
      console.log(`[api/generate/videos] there is already a video file: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)
    }
  }

  console.log(`[api/generate/videos] returning the clap augmented with videos`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
