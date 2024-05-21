import YAML from "yaml"

import { sleep } from "@/lib/utils/sleep"
import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/parsers/parseRawStringToYAML"
import { LatentStory } from "@/app/api/v1/types"

import { systemPromptExtendStory } from "./systemPromptExtendStory"

export async function extendLatentStoryWithMoreShots({
  prompt = "",
  latentStory = [],
  nbShots = 4,
  turbo = false,
}: {
  prompt?: string
  latentStory?: LatentStory[]
  nbShots?: number
  turbo?: boolean
} = {
  prompt: "",
  latentStory: [],
  nbShots: 4,
  turbo: false
}): Promise<LatentStory[]> {

  if (!prompt.length) { throw new Error(`please provide a prompt`) }

  if (!latentStory.length) { throw new Error(`please provide a story`) }

  // console.log("generateEntityPrompts(): latentStory:", latentStory)

  // this is where we are going to have some trouble:
  // basically we need to slice this to only keep the remaining part
  // OR use a model with a large token window, like Gemini 🤷

  const nbMaxCharacters = 2700

  let initialStory = YAML.stringify(
    // we need to help the LLM by marking the shots with a simple numeric ID
    // latentStory.map((shot, i) => ({
    //   shot: i,
    //   ...shot,
    // }))

    // ..well no, actually we don't!
    latentStory
  )

  let compressedStory = initialStory

  console.log(`extendLatentStoryWithMoreShots(): generated a story prompt from ${latentStory.length} shots (chars)`)
 
 
  // we crop the beginning
  if (compressedStory.length > nbMaxCharacters) {
    compressedStory = compressedStory.slice(compressedStory.length - nbMaxCharacters, compressedStory.length)
  }

  if (compressedStory.length !== initialStory.length) {
    console.log("extendLatentStoryWithMoreShots(): WARNING: we hit the max character limit (${nbMaxCharacters} chars)")
  }

  const userPrompt = `General description of the whole video: ${prompt}

number of shots to extend: ${nbShots}

\`\`\`yaml
${compressedStory}
\`\`\`

# YAML-only output
`

  const prefix = "```yaml\n"
  const nbMaxNewTokens = nbShots * 300

  // TODO use streaming for the Hugging Face prediction
  //
  // note that a Clap file is actually a YAML stream of documents
  // so technically we could stream everything from end-to-end
  // (but I haven't coded the helpers to do this yet)
  let rawString = await predict({
    systemPrompt: systemPromptExtendStory,
    userPrompt,
    nbMaxNewTokens,
    prefix,
    turbo,
  })

  // console.log("api/v1/create(): rawString: ", rawString)

  let newShots: LatentStory[] = []

  let maybeNewShots = parseRawStringToYAML<LatentStory[]>(rawString, [])

  if (!Array.isArray(maybeNewShots) || maybeNewShots.length === 0) {
    console.log(`api/v1/create(): failed to generate new shots.. trying again`)
    
    await sleep(2000)

    rawString = await predict({
      systemPrompt: systemPromptExtendStory,
      userPrompt: userPrompt + ".", // we trick the Hugging Face cache
      nbMaxNewTokens,
      prefix,
      turbo,
    })

    // console.log("api/v1/create(): rawString: ", rawString)

    maybeNewShots = parseRawStringToYAML<LatentStory[]>(rawString, [])
    if (!Array.isArray(maybeNewShots) || maybeNewShots.length === 0) {
      console.log(`api/v1/create(): failed to generate new shots for the second time, which indicates an issue with the Hugging Face API`)
    }
  }

  if (maybeNewShots.length) {
    newShots = maybeNewShots
  } else {
    throw new Error(`Hugging Face Inference API failure (the model failed to generate the shots)`)
  }

  console.log(`api/v1/create(): generated ${newShots.length} new shots`)

  return newShots
}
