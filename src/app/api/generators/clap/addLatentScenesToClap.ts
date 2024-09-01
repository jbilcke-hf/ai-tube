"use server"

import { ClapOutputType, ClapProject, ClapSegmentCategory, newSegment } from "@aitube/clap"

import { LatentScenes } from "./types"
import { defaultSegmentDurationInMs } from "./constants"


/**
 * This generates a fully valid Clap blob (compressed archive)
 * 
 * @param param0 
 * @returns 
 */
export async function addLatentScenesToClap({
  scenes = [],
  clap,
  debug = false
}: {
  scenes?: LatentScenes
  clap: ClapProject
  debug?: boolean
}): Promise<ClapProject> {

  if (!Array.isArray(scenes) || !scenes?.length) {
    return clap
  }

  let startTimeInMs = 0
  let endTimeInMs = defaultSegmentDurationInMs

  clap.segments.push(newSegment({
    track: 0,
    startTimeInMs,
    endTimeInMs,
    category: ClapSegmentCategory.INTERFACE,
    prompt: "<BUILTIN:DISCLAIMER>",
    label: "fish",
    outputType: ClapOutputType.INTERFACE
  }))

  for (const { characters, locations, actions } of scenes) {

    startTimeInMs = endTimeInMs
    endTimeInMs = startTimeInMs + defaultSegmentDurationInMs
    let track = 0

    for (const character of characters) {
      clap.segments.push(newSegment({
        track: track++,
        startTimeInMs,
        endTimeInMs,
        category: ClapSegmentCategory.CHARACTER,
        prompt: character,
        label: character,
        outputType: ClapOutputType.TEXT,
      }))
    }
  
    for (const location of locations) {
      clap.segments.push(newSegment({
        track: track++,
        startTimeInMs,
        endTimeInMs,
        category: ClapSegmentCategory.LOCATION,
        prompt: location,
        label: location,
        outputType: ClapOutputType.TEXT,
      }))
    }
  
    for (const action of actions) {
      clap.segments.push(newSegment({
        track: track++,
        startTimeInMs,
        endTimeInMs,
        category: ClapSegmentCategory.ACTION,
        prompt: action,
        label: action,
        outputType: ClapOutputType.TEXT,
      }))
    }
        
    clap.segments.push(newSegment({
      track: track++,
      startTimeInMs,
      endTimeInMs,
      category: ClapSegmentCategory.VIDEO,
      prompt: "video",
      label: "video",
      outputType: ClapOutputType.VIDEO,
    }))
  }

  if (debug) {
    console.log("latentScenesToClap: unpacked Clap content = ", JSON.stringify(clap, null, 2))
  }


  return clap
}