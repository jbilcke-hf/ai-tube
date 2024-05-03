"use server"

import YAML from "yaml"

import { predict as predictWithHuggingFace } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { predict as predictWithOpenAI } from "@/app/api/providers/openai/predictWithOpenAI"
import { LatentSearchResults } from "./types"
import { getSystemPrompt } from "./getSystemPrompt"
import { parseRawStringToYAML } from "../../parsers/parseRawStringToYAML"
import { unknownObjectToLatentSearchResults } from "./unknownObjectToLatentSearchResults"

export async function getLatentSearchResults({
  prompt = "",
  debug = false
}: {
  prompt?: string
  debug?: boolean
} = {}): Promise<LatentSearchResults> {

  // abort early
  if (!prompt) { 
    return []
  }

  const systemPrompt = getSystemPrompt()

  const nbSearchResults = 8

  const userPrompt = `${nbSearchResults} search results for "${prompt}"`

  let results: LatentSearchResults = []
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
      console.log("getLatentSearchResults: rawString = " + rawString)
    }

    const maybeLatentSearchResults = parseRawStringToYAML<LatentSearchResults>(rawString, [])

    results = unknownObjectToLatentSearchResults(maybeLatentSearchResults)

    if (debug) {
      console.log(`getLatentSearchResults: scenes = ` + JSON.stringify(results, null, 2))
    }
  } catch (err) {
    results = []
    console.error(`getLatentSearchResults failed (${err})`)
  }

  return results
}