
import YAML from "yaml"

import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { LatentStory } from "@/app/api/v1/types"

import { systemPrompt } from "./systemPrompt"

export async function generateMusicPrompts({
  prompt = "",
  latentStory = [],
  turbo = false,
}: {
  prompt?: string
  latentStory?: LatentStory[]
  turbo?: boolean
} = {
  prompt: "",
  latentStory: [],
  turbo: false
}): Promise<string[]> {

  if (!prompt.length) { throw new Error(`please provide a prompt`) }
  console.log("generateMusicPrompts(): prompt:", prompt)


  if (!latentStory.length) { throw new Error(`please provide a story`) }

  console.log("generateMusicPrompts(): latentStory:", latentStory)

  const userPrompt = `The input story is about: ${prompt}.

The input story is:
\`\`\`yaml
${YAML.stringify(
  // we need to help the LLM by marking the shots with a simple numeric ID
  latentStory.map((shot, i) => ({
    shot: i,
    ...shot,
  }))
)}
\`\`\`

# Output`

  const prefix = "\""

  // we don't need a lot here!
  const nbMaxNewTokens = 120

  // TODO use streaming for the Hugging Face prediction
  //
  // note that a Clap file is actually a YAML stream of documents
  // so technically we could stream everything from end-to-end
  // (but I haven't coded the helpers to do this yet)
  let rawString = await predict({
    systemPrompt,
    userPrompt,
    nbMaxNewTokens,
    prefix,
    turbo,
  })

  // console.log("generateEntityPrompts(): rawString: ", rawString)

  let results: string[] = []
  
  // we remove everything after the last ``` (or ``)
  rawString = rawString.split(/```?/)[0].trim()
  results.push(rawString)

  if (!Array.isArray(results) || typeof results.at(0) !== "string" || !results) {
    throw new Error(`failed to generate the output (rawString is: ${rawString})`)
  }

  return results
}
