"use server"

import { serializeClap } from "@/lib/clap/serializeClap"
import { newClap } from "@/lib/clap/newClap"
import { getEmptyClap } from "@/lib/clap/emptyClap"

import { LatentScenes } from "./types"
import { addLatentScenesToClap } from "./addLatentScenesToClap"
import { getLatentScenes } from "./getLatentScenes"

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

  const empty = await getEmptyClap()

  if (!prompt?.length) { 
    return empty
  }

  let clap = newClap({
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

  const archive = await serializeClap(clap)

  return archive
}