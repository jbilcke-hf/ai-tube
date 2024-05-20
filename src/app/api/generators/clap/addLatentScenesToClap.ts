"use server"

import { ClapProject, newSegment } from "@aitube/clap"

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
    category: "interface",
    prompt: "<BUILTIN:DISCLAIMER>",
    label: "fish",
    outputType: "interface",
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
        category: "characters",
        prompt: character,
        label: character,
        outputType: "text",
      }))
    }
  
    for (const location of locations) {
      clap.segments.push(newSegment({
        track: track++,
        startTimeInMs,
        endTimeInMs,
        category: "location",
        prompt: location,
        label: location,
        outputType: "text",
      }))
    }
  
    for (const action of actions) {
      clap.segments.push(newSegment({
        track: track++,
        startTimeInMs,
        endTimeInMs,
        category: "action",
        prompt: action,
        label: action,
        outputType: "text",
      }))
    }
        
    clap.segments.push(newSegment({
      track: track++,
      startTimeInMs,
      endTimeInMs,
      category: "video",
      prompt: "video",
      label: "video",
      outputType: "video",
    }))
  }

  if (debug) {
    console.log("latentScenesToClap: unpacked Clap content = ", JSON.stringify(clap, null, 2))
  }


  return clap
}