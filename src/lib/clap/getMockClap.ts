import { newClap } from "./newClap"
import { newSegment } from "./newSegment"
import { ClapProject } from "./types"

let defaultSegmentDurationInMs = 2000

let demoPrompt = "closeup of Queen angelfish, bokeh"
// demoPrompt = "portrait of a man tv news anchor, pierre-jean-hyves, serious, bokeh"
// demoPrompt = "screenshot from Call of Duty, FPS game, nextgen, videogame screenshot, unreal engine, raytracing"
demoPrompt = "screenshot from a flight simulator, nextgen, videogame screenshot, unreal engine, raytracing"
demoPrompt = "screenshot from fallout3, fallout4, wasteland, 3rd person RPG, nextgen, videogame screenshot, unreal engine, raytracing"

export function getMockClap({
  prompt = demoPrompt,
  showDisclaimer = true,
}: {
  prompt?: string
  showDisclaimer?: boolean
} = {
  prompt: demoPrompt,
  showDisclaimer: true,
}): ClapProject {
  const clap = newClap({
    meta: {
      streamType: "interactive"
    }
  })

  let currentElapsedTimeInMs = 0
  let currentSegmentDurationInMs = defaultSegmentDurationInMs

  if (showDisclaimer) {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "interface",
      prompt: "<BUILTIN:DISCLAIMER>",
      label: "fish",
      outputType: "interface",
    }))
    currentElapsedTimeInMs += currentSegmentDurationInMs
  }

  /*
  clap.segments.push(
    newSegment({
      // id: string
      // track: number
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "interface",
      // modelId: string
      // sceneId: string
      prompt: "a hello world",
      label: "hello world",
      outputType: "interface"
      // renderId: string
      // status: ClapSegmentStatus
      // assetUrl: string
      // assetDurationInMs: number
      // createdBy: ClapAuthor
      // editedBy: ClapAuthor
      // outputGain: number
      // seed: number
    })
  )

  currentElapsedTimeInMs += currentSegmentDurationInMs
  */
  
  // this is just for us, to quickly switch between video or image
  const generationMode: "IMAGE" | "VIDEO" =
  "VIDEO"
  //"IMAGE"

  if (generationMode === "VIDEO") {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "video",
      prompt,
      label: "demo",
      outputType: "video",
    }))
  } else {
    clap.segments.push(newSegment({
      startTimeInMs: currentElapsedTimeInMs,
      endTimeInMs: currentSegmentDurationInMs,
      category: "storyboard",
      prompt,
      label: "demo",
      outputType: "image",
    }))
  }

  return clap
}