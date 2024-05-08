"use server"

import YAML from "yaml"
import { ClapSegmentCategory, generateSeed } from "@aitube/clap"
import { ClapEntityPrompt } from "@aitube/client"

import { sleep } from "@/lib/utils/sleep"
import { predict } from "@/app/api/providers/huggingface/predictWithHuggingFace"
import { parseRawStringToYAML } from "@/app/api/parsers/parseRawStringToYAML"
import { LatentEntity, LatentStory } from "@/app/api/v1/types"

import { systemPrompt } from "./systemPrompt"
import { generateImageID } from "./generateImageID"

export type EntityPromptResult = {
  entityPrompt: ClapEntityPrompt
  shots: number[]
}

// a helper to generate Clap stories from a few sentences
// this is mostly used by external apps such as the Stories Factory
export async function generateEntityPrompts({
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
}): Promise<EntityPromptResult[]> {

  if (!prompt.length) { throw new Error(`please provide a prompt`) }
  console.log("generateEntityPrompts(): prompt:", prompt)


  if (!latentStory.length) { throw new Error(`please provide a story`) }

  console.log("generateEntityPrompts(): latentStory:", latentStory)

  const userPrompt = `The input story is about: ${prompt}.

The input story timeline is:
\`\`\`yaml
${YAML.stringify(
  // we need to help the LLM by marking the shots with a simple numeric ID
  latentStory.map((shot, i) => ({
    shot: i,
    ...shot,
  }))
)}
\`\`\`

Now please generate the output entities:`

  const prefix = "```yaml\n"
  const nbMaxNewTokens = 1400

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

  console.log("generateEntityPrompts(): rawString: ", rawString)

  let results: EntityPromptResult[] = []
  
  let maybeEntities = parseRawStringToYAML<LatentEntity[]>(rawString, [])

  if (!Array.isArray(maybeEntities) || maybeEntities.length === 0) {
    console.log(`generateEntityPrompts(): failed to generate entities.. trying again`)
    
    await sleep(2000)

    rawString = await predict({
      systemPrompt,
      userPrompt: userPrompt + ".", // we trick the Hugging Face cache
      nbMaxNewTokens,
      prefix,
      turbo,
    })
  
    console.log("generateEntityPrompts(): rawString: ", rawString)
  
    maybeEntities = parseRawStringToYAML<LatentEntity[]>(rawString, [])
    if (!Array.isArray(maybeEntities) || maybeEntities.length === 0) {
      console.log(`generateEntityPrompts(): failed to generate shots for the second time, which indicates an issue with the Hugging Face API`)
    }
  }

  if (maybeEntities.length) {
    results = await Promise.all(
      maybeEntities

      // the LLM generates unrelated catrgories unfortunately,
      // that we still turn into image.. so we fix that by filtering
      .filter(({ category }) => category !== ClapSegmentCategory.CHARACTER)

      .map(async ({
      name,
      category,
      image,
      audio,
      shots,
    }) => {

      const entityPrompt: ClapEntityPrompt = {
        name,
        category,
        age: "",
        variant: image,
        region: "",
        identityImage: await generateImageID({
          prompt: image,
          seed: generateSeed(),
          turbo,
        }),

        // TODO later 
        identityVoice: "" // await generateAudioID({ prompt: e.audio, seed: generateSeed() })
      }

      const result: EntityPromptResult = {
        entityPrompt,
        shots
      }

      return result
    }))
  } else {
    throw new Error(`Hugging Face Inference API failure (the model failed to generate the entities)`)
  }

  console.log(`generateEntityPrompts(): generated ${results.length} entities with their images and voice ids`)

  return results
}
