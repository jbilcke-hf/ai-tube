import { ClapOutputType, ClapProject, ClapSegmentCategory, newClap, newSegment } from "@aitube/clap"

import { defaultSegmentDurationInMs, demoStory } from "./samples"

export function generateClapFromPrompt({
  story = demoStory,
  showIntroPoweredByEngine = false,
  showIntroDisclaimerAboutAI = false,
}: {
  story?: string[]
  showIntroPoweredByEngine?: boolean
  showIntroDisclaimerAboutAI?: boolean
} = {
  story: demoStory,
  showIntroPoweredByEngine: false,
  showIntroDisclaimerAboutAI: false,
}): ClapProject {

  const clap = newClap({
    meta: {
      title: "Interactive Demo",
      isInteractive: true,
      isLoop: true,
      description: story,
      synopsis: story,
    }
  })

  let startTimeInMs = 0
  let endTimeInMs = defaultSegmentDurationInMs

  if (showIntroPoweredByEngine) {
    clap.segments.push(newSegment({
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.INTERFACE,
      prompt: "<BUILTIN:POWERED_BY_ENGINE>",
      label: "disclaimer",
      outputType: ClapOutputType.INTERFACE,
    }))
    startTimeInMs += defaultSegmentDurationInMs
    endTimeInMs += defaultSegmentDurationInMs
  }

  if (showIntroDisclaimerAboutAI) {
    clap.segments.push(newSegment({
      startTimeInMs,
      endTimeInMs,
      category:ClapSegmentCategory.INTERFACE,
      prompt: "<BUILTIN:DISCLAIMER_ABOUT_AI>",
      label: "disclaimer",
      outputType: ClapOutputType.INTERFACE,
    }))
    startTimeInMs += defaultSegmentDurationInMs
    endTimeInMs += defaultSegmentDurationInMs
  }

  /*
  clap.segments.push(
    newSegment({
      // id: string
      // track: number
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.INTERFACE,
      // entityId: string
      // sceneId: string
      prompt: "a hello world",
      label: "hello world",
      outputType: ClapOutputType.INTERFACE,
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
    startTimeInMs += defaultSegmentDurationInMs
    endTimeInMs += defaultSegmentDurationInMs
  */
  
 

  for (let prompt of story) {

    clap.segments.push(newSegment({
      track: 0,
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: "",
      label: "video",
      outputType: ClapOutputType.VIDEO,
    }))
    clap.segments.push(newSegment({
      track: 1,
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.GENERIC,
      prompt,
      label: prompt,
      outputType: ClapOutputType.TEXT,
    }))
    clap.segments.push(newSegment({
      track: 2,
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.CAMERA,
      prompt: "medium-shot",
      label: "medium-shot",
      outputType: ClapOutputType.TEXT,
    }))

    startTimeInMs += defaultSegmentDurationInMs
    endTimeInMs += defaultSegmentDurationInMs
  }

  clap.meta.durationInMs = endTimeInMs

  return clap
}