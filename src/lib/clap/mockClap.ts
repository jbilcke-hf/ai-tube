import { newClap } from "./newClap"
import { newSegment } from "./newSegment"
import { ClapProject } from "./types"

export function mockClap(): ClapProject {
  const clap = newClap()

  const mockSegment = newSegment({
    // id: string
    // track: number
    // startTimeInMs: number
    // endTimeInMs: number
    // category: ClapSegmentCategory
    // modelId: string
    // sceneId: string
    // prompt: string
    // label: string
    // outputType: ClapOutputType
    // renderId: string
    // status: ClapSegmentStatus
    // assetUrl: string
    // assetDurationInMs: number
    // createdBy: ClapAuthor
    // editedBy: ClapAuthor
    // outputGain: number
    // seed: number
  })
  clap.segments.push(mockSegment)

  return clap
}