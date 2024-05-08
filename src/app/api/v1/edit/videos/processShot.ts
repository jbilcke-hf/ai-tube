
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  newSegment,
  filterSegments,
  ClapSegmentFilteringMode
} from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"
import { getVideoPrompt } from "@aitube/engine"

import { getPositivePrompt } from "@/app/api/utils/imagePrompts"

import { generateVideo } from "./generateVideo"


export async function processShot({
  shotSegment,
  existingClap,
  newerClap,
  mode,
  turbo,
}: {
  shotSegment: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
  turbo: boolean
}): Promise<void> {
  const shotSegments: ClapSegment[] = filterSegments(
    ClapSegmentFilteringMode.START,
    shotSegment,
    existingClap.segments
  )

  const shotVideoSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === "video"
  )

  let shotVideoSegment: ClapSegment | undefined = shotVideoSegments.at(0)
  
  console.log(`[api/edit/videos] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotVideoSegments.length} videos)`)

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

    // we fix the existing clap
    if (shotVideoSegment) {
      existingClap.segments.push(shotSegment)
    }

    console.log(`[api/edit/videos] processShot: generated video segment [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}]`)
  }

  if (!shotVideoSegment) {
    throw new Error(`failed to generate a new segment`)
  }


  // TASK 2: GENERATE MISSING VIDEO PROMPT
  if (!shotVideoSegment?.prompt) {
    // video is missing, let's generate it
    shotVideoSegment.prompt = getVideoPrompt(
      shotSegments,
      existingClap.entityIndex,
      ["high quality", "crisp", "detailed"]
    )
    console.log(`[api/edit/videos] processShot: generating video prompt: ${shotVideoSegment.prompt}`)
  }

  // TASK 3: GENERATE MISSING VIDEO FILE
  if (!shotVideoSegment.assetUrl) {
    console.log(`[api/edit/videos] processShot: generating video file..`)

    try {
      shotVideoSegment.assetUrl = await generateVideo({
        prompt: getPositivePrompt(shotVideoSegment.prompt),
        width: existingClap.meta.width,
        height: existingClap.meta.height,
        turbo,
      })
      shotVideoSegment.assetSourceType = getClapAssetSourceType(shotVideoSegment.assetUrl)
    } catch (err) {
      console.log(`[api/edit/videos] processShot: failed to generate a video file: ${err}`)
      throw err
    }
  
    console.log(`[api/edit/videos] processShot: generated video files: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)

    // if mode is full, newerClap already contains the ference to shotVideoSegment
    // but if it's partial, we need to manually add it
    if (mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotVideoSegment)
    }
    
  } else {
    console.log(`[api/edit/videos] processShot: there is already a video file: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)
  }
}