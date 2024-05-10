
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  newSegment,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapOutputType,
  ClapSegmentCategory,
  parseMediaOrientation
} from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"
import { getVideoPrompt } from "@aitube/engine"

import { getPositivePrompt } from "@/app/api/utils/imagePrompts"

import { render } from "@/app/api/v1/render"

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
    ClapSegmentFilteringMode.BOTH,
    shotSegment,
    existingClap.segments
  )

  const shotVideoSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === ClapSegmentCategory.VIDEO
  )

  let shotVideoSegment: ClapSegment | undefined = shotVideoSegments.at(0)
  
  // console.log("bug here?", turbo)

  console.log(`[api/edit/videos] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotVideoSegments.length} videos)`)

  // TASK 1: GENERATE MISSING VIDEO SEGMENT
  if (!shotVideoSegment) {
    shotVideoSegment = newSegment({
      track: 1,
      startTimeInMs: shotSegment.startTimeInMs,
      endTimeInMs: shotSegment.endTimeInMs,
      assetDurationInMs: shotSegment.assetDurationInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: "",
      assetUrl: "",
      outputType: ClapOutputType.VIDEO
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
    // console.log(`[api/edit/videos] processShot: generating video file..`)

    const debug = false

    let width = existingClap.meta.width
    let height = existingClap.meta.height

    // if (turbo) {
    // width = Math.round(width / 2)
    // height = Math.round(height / 2)
    // }

    if (width > height) {
      width = 512
      height = 288
    } else if (width < height) {
      width = 288
      height = 512
    } else {
      width = 512
      height = 512
    }
    try {
      shotVideoSegment.assetUrl = await render({
        prompt: getPositivePrompt(shotVideoSegment.prompt),
        seed: shotSegment.seed,
        width,
        height,
        nbFrames: 80,
        nbFPS: 24,
        nbSteps: 4, // turbo ? 4 : 8,
        debug,
      })
      shotVideoSegment.assetSourceType = getClapAssetSourceType(shotVideoSegment.assetUrl)
    } catch (err) {
      console.log(`[api/edit/videos] processShot: failed to generate a video file: ${err}`)
      throw err
    }
  
    // console.log(`[api/edit/videos] processShot: generated video files: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)

    // if mode is full, newerClap already contains the ference to shotVideoSegment
    // but if it's partial, we need to manually add it
    if (mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotVideoSegment)
    }
    
  } else {
    console.log(`[api/edit/videos] processShot: there is already a video file: ${shotVideoSegment?.assetUrl?.slice?.(0, 50)}...`)
  }
}