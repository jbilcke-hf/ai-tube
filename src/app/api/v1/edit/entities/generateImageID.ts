
import { generateSeed } from "@aitube/clap"

import { sleep } from "@/lib/utils/sleep"

import { newRender, getRender } from "@/app/api/providers/videochain/renderWithVideoChain"
import { getNegativePrompt, getPositivePrompt } from "@/app/api/utils/imagePrompts"

export async function generateImageID({
  prompt,
  // negativePrompt,
  seed,
}: {
  prompt: string
  // negativePrompt?: string
  seed?: number
}) {
  
  // those can be constants for a face ID
  // also we want something a bit portrait-ish
  // but this risk creating a lot of variability in poses
  // so perhaps we should use a controlnet to condition the face scale and position,
  // to make sure it is uniform in size across all models
  const width = 1024
  const height = 768

  // console.log("calling await newRender")
  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()

  let render = await newRender({
    prompt,
    negativePrompt,
    nbFrames: 1,
    nbFPS: 1,

    // note: for the model ID we might want to maximize things here,
    // and maybe not use the "turbo" - but I'm not sure
    width,
    height,
    nbSteps: 8,
    turbo: true,

    shouldRenewCache: true,
    seed: seed || generateSeed()
  })

  let attempts = 10

  while (attempts-- > 0) {
    if (render.status === "completed") {
      return render.assetUrl
    }

    if (render.status === "error") {
      console.error(render.error)
      throw new Error(`failed to generate the image ${render.error}`)
    }

    await sleep(2000) // minimum wait time

    // console.log("asking getRender")
    render = await getRender(render.renderId)
  }

  throw new Error(`failed to generate the image`)
}
