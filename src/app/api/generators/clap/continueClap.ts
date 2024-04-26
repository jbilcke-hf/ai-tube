"use server"

import { ClapProject, serializeClap } from "@aitube/clap"

import { LatentScenes } from "./types"
import { addLatentScenesToClap } from "./addLatentScenesToClap"
import { getLatentScenes } from "./getLatentScenes"

/**
 * Imagine the continuity of a Clap file
 * 
 * This serves multiple purpose, such as being able to create
 * long stories in a more streamed way
 * 
 * This should integrate multiple factors such as the event history, actions etc
 *
 * Be careful however as the context will grow at the same time as the story
 * (it's the same issue as in the AI Comic Factory)
 * so it may become harder and/or slower to perform the query
 */
export async function continueClap({
  clap,
  mode = "replace", // "append"
  debug = false
}: {
  clap: ClapProject

  // whether to replace or append the content
  // replacing is the most efficient way to do things (smaller files)
  // so it is the default mode
  mode: "replace" | "append"

  debug?: boolean
}): Promise<Blob> {

  // TODO a prompt like "imagine the next steps from.."
  const prompt = ""

  const scenes: LatentScenes = await getLatentScenes({
    prompt,
    debug,
  })

  // by default we always replace the content,
  // so we need to remove the previous one
  if (mode !== "append") {
    clap.scenes = []
  }

  clap = await addLatentScenesToClap({
    clap,
    scenes,
    debug,
  })

  // a Clap must always be transported as a zipped file
  // technically, it could also be transported as text
  // (and gzipped automatically between the HTTP server and browser)
  // but I think it is better to keep the idea of a dedicated file format
  const archive: Blob = await serializeClap(clap)

  return archive
}