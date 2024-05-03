import { ClapProject, ClapSegment, getClapAssetSourceType, newSegment, filterSegments, ClapSegmentFilteringMode } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { getPositivePrompt } from "@/app/api/utils/imagePrompts"

import { generateStoryboard } from "./generateStoryboard"
import { ClapCompletionMode } from "../types"

export async function processShot({
  shotSegment,
  existingClap,
  newerClap,
  mode
}: {
  shotSegment: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
}): Promise<void> {

  const shotSegments: ClapSegment[] = filterSegments(
    ClapSegmentFilteringMode.START,
    shotSegment,
    existingClap.segments
  )

  const shotStoryboardSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === "storyboard"
  )

  let shotStoryboardSegment: ClapSegment | undefined = shotStoryboardSegments.at(0)

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

    // we fix the existing clap
    if (shotStoryboardSegment) {
      existingClap.segments.push(shotStoryboardSegment)
    }

    console.log(`[api/v1/edit/storyboards] processShot: generated storyboard segment [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}]`)
  }

  if (!shotStoryboardSegment) { throw new Error(`failed to generate a newSegment`) }

  // TASK 2: GENERATE MISSING STORYBOARD PROMPT
  if (!shotStoryboardSegment?.prompt) {
    // storyboard is missing, let's generate it
    shotStoryboardSegment.prompt = getVideoPrompt(
      shotSegments,
      existingClap.entityIndex,
      ["high quality", "crisp", "detailed"]
    )
    console.log(`[api/v1/edit/storyboards] processShot: generating storyboard prompt: ${shotStoryboardSegment.prompt}`)
  }

  // TASK 3: GENERATE MISSING STORYBOARD BITMAP
  if (!shotStoryboardSegment.assetUrl) {
    // console.log(`[api/v1/edit/storyboards] generating image..`)

    try {
      shotStoryboardSegment.assetUrl = await generateStoryboard({
        prompt: getPositivePrompt(shotStoryboardSegment.prompt),
        width: existingClap.meta.width,
        height: existingClap.meta.height,
      })
      shotStoryboardSegment.assetSourceType = getClapAssetSourceType(shotStoryboardSegment.assetUrl)
    } catch (err) {
      console.log(`[api/v1/edit/storyboards] processShot: failed to generate an image: ${err}`)
      throw err
    }
  
    console.log(`[api/v1/edit/storyboards] processShot: generated storyboard image: ${shotStoryboardSegment?.assetUrl?.slice?.(0, 50)}...`)  

    // if mode is full, newerClap already contains the ference to shotStoryboardSegment
    // but if it's partial, we need to manually add it
    if (mode === "partial") {
      newerClap.segments.push(shotStoryboardSegment)
    }
  } else {
    console.log(`[api/v1/edit/storyboards] processShot: there is already a storyboard image: ${shotStoryboardSegment?.assetUrl?.slice?.(0, 50)}...`)
  }

}
