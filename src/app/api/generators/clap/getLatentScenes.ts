"use server"

import YAML from "yaml"

import { predict as predictWithHuggingFace } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { predict as predictWithOpenAI } from "@/app/api/providers/openai/predictWithOpenAI"

import { LatentScenes } from "./types"
import { getSystemPrompt } from "./getSystemPrompt"
import { unknownObjectToLatentScenes } from "./unknownObjectToLatentScenes"
import { parseRawStringToYAML } from "../../parsers/parseRawStringToYAML"

export async function getLatentScenes({
  prompt = "",
  debug = false
}: {
  prompt?: string
  debug?: boolean
} = {}): Promise<LatentScenes> {

  // abort early
  if (!prompt) { 
    return []
  }

  const systemPrompt = getSystemPrompt()

  const userPrompt = `generate a short story about: ${prompt}`

  let scenes: LatentScenes = []
  try {
    // we use Hugging Face for now, as our users might try funny things,
    // which could get us banned from OpenAI
    let rawString = await predictWithHuggingFace({
      systemPrompt,
      userPrompt,
      nbMaxNewTokens: 1200,
      prefix: "",
    })

    if (debug) {
      console.log("getLatentScenes: rawString = " + rawString)
    }

    const maybeLatentScenes = parseRawStringToYAML<LatentScenes>(rawString, [])

    scenes = unknownObjectToLatentScenes(maybeLatentScenes)

    if (debug) {
      console.log(`getLatentScenes: scenes = ` + JSON.stringify(scenes, null, 2))
    }
  } catch (err) {
    scenes = []
    console.error(`getLatentScenes failed (${err})`)
  }

  return scenes
}