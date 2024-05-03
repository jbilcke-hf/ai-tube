import { ClapProject, ClapSegment, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"
import { getVideoPrompt } from "@aitube/engine"

import { startOfSegment1IsWithinSegment2 } from "@/lib/utils/startOfSegment1IsWithinSegment2"

import { getPositivePrompt } from "@/app/api/utils/imagePrompts"
import { generateStoryboard } from "./generateStoryboard"

export async function processShot({
  shotSegment,
  clap
}: {
  shotSegment: ClapSegment
  clap: ClapProject
}): Promise<void> {

  const shotSegments: ClapSegment[] = clap.segments.filter(s =>
    startOfSegment1IsWithinSegment2(s, shotSegment)
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

    if (shotStoryboardSegment) {
      clap.segments.push(shotStoryboardSegment)
    }

    console.log(`[api/v1/edit/storyboards] processShot: generated storyboard segment [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}]`)
  }
  if (!shotStoryboardSegment) { throw new Error(`failed to generate a newSegment`) }

  // TASK 2: GENERATE MISSING STORYBOARD PROMPT
  if (!shotStoryboardSegment?.prompt) {
    // storyboard is missing, let's generate it
    shotStoryboardSegment.prompt = getVideoPrompt(shotSegments, clap.entityIndex, ["high quality", "crisp", "detailed"])
    console.log(`[api/v1/edit/storyboards] processShot: generating storyboard prompt: ${shotStoryboardSegment.prompt}`)
  }

  // TASK 3: GENERATE MISSING STORYBOARD BITMAP
  if (!shotStoryboardSegment.assetUrl) {
    // console.log(`[api/v1/edit/storyboards] generating image..`)

    try {
      shotStoryboardSegment.assetUrl = await generateStoryboard({
        prompt: getPositivePrompt(shotStoryboardSegment.prompt),
        width: clap.meta.width,
        height: clap.meta.height,
      })
      shotStoryboardSegment.assetSourceType = getClapAssetSourceType(shotStoryboardSegment.assetUrl)
    } catch (err) {
      console.log(`[api/v1/edit/storyboards] processShot: failed to generate an image: ${err}`)
      throw err
    }
  
    console.log(`[api/v1/edit/storyboards] processShot: generated storyboard image: ${shotStoryboardSegment?.assetUrl?.slice?.(0, 50)}...`)
  } else {
    console.log(`[api/v1/edit/storyboards] processShot: there is already a storyboard image: ${shotStoryboardSegment?.assetUrl?.slice?.(0, 50)}...`)
  }

}
