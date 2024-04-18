import { newClap } from "./newClap"
import { newSegment } from "./newSegment"
import { ClapProject } from "./types"

let defaultSegmentDurationInMs = 2000

export function mockClap({
  showDisclaimer
}: {
  showDisclaimer: boolean
}): ClapProject {
  const clap = newClap()

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
    
  clap.segments.push(newSegment({
    startTimeInMs: currentElapsedTimeInMs,
    endTimeInMs: currentSegmentDurationInMs,
    category: "video",
    // prompt: "closeup of Queen angelfish, bokeh",
    prompt: "portrait of a man tv news anchor, pierre-jean-hyves, serious, bokeh",
    label: "demo",
    outputType: "video",
  }))

  return clap
}