"use server"

import YAML from "yaml"

import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/parsers/parseRawStringToYAML"

import { systemPromptForBasicSearchResults, systemPromptForExtendedSearchResults } from "./systemPrompt"
import type { BasicSearchResult, ExtendedSearchResult } from "./types"

export async function search({
  prompt = "",
  nbResults = 4
}: {
  prompt: string
  nbResults: number
}): Promise<BasicSearchResult[]> {
  const userPrompt = `${
    Math.max(1, Math.min(8, nbResults))
  } search results about: ${
    prompt || "various trending genres"
  }`

  // TODO use streaming for the Hugging Face prediction
  const rawString = await predict({
    systemPrompt: systemPromptForBasicSearchResults,
    userPrompt,
    nbMaxNewTokens: nbResults * 80,
    prefix: "```yaml\n",
  })

  console.log("rawString: ", rawString)

  const results = parseRawStringToYAML<BasicSearchResult[]>(rawString, [])

  return results
}

export async function extend({
  basicResults = [],
}: {
  basicResults: BasicSearchResult[]
}): Promise<ExtendedSearchResult[]> {
  const userPrompt = YAML.stringify(basicResults)


  // TODO use streaming for the Hugging Face prediction
  const rawString = await predict({
    systemPrompt: systemPromptForExtendedSearchResults,
    userPrompt,
    nbMaxNewTokens: basicResults.length * 200,
    prefix: "```yaml\n",
  })

  console.log("rawString: ", rawString)

  const results = parseRawStringToYAML<ExtendedSearchResult[]>(rawString, [])

  return results
}
