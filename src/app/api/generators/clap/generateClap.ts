"use server"


import { LatentScenes } from "./types"
import { addLatentScenesToClap } from "./addLatentScenesToClap"
import { getLatentScenes } from "./getLatentScenes"
import { ClapProject, getEmptyClap, newClap, serializeClap } from "@aitube/clap"

/**
 * Generate a Clap file from scratch using a prompt
 */
export async function generateClap({
  prompt = "",
  debug = false
}: {
  prompt?: string
  debug?: boolean
} = {
  prompt: "",
  debug: false,
}): Promise<Blob> {

  const empty: Blob = await getEmptyClap()

  if (!prompt?.length) { 
    return empty
  }

  let clap: ClapProject = newClap({
    meta: {
      title: "Latent content", // TODO "
      description: "",
      licence: "non commercial",
      orientation: "landscape",
      width: 1024,
      height: 576,
      defaultVideoModel: "SDXL",
      extraPositivePrompt: [],
      screenplay: "",
      isLoop: true,
      isInteractive: true,
    } 
  })

  const scenes: LatentScenes = await getLatentScenes({
    prompt,
    debug,
  })


  clap = await addLatentScenesToClap({
    clap,
    scenes,
    debug,
  })

  const archive: Blob = await serializeClap(clap)

  return archive
}