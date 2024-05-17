import { generateSeed, getValidNumber } from "@aitube/clap"

import { newRender, getRender } from "@/app/api/providers/videochain/renderWithVideoChain"
import { sleep } from "@/lib/utils/sleep"
import { getNegativePrompt, getPositivePrompt } from "@/app/api/utils/imagePrompts"

export async function generateStoryboard({
  prompt,
  // negativePrompt,
  identityImage,
  width,
  height,
  seed,
  turbo = false,
}: {
  prompt: string
  // negativePrompt?: string
  identityImage?: string
  width?: number
  height?: number
  seed?: number
  turbo?: boolean
}): Promise<string> {
  
  width = getValidNumber(width, 256, 8192, 512)
  height = getValidNumber(height, 256, 8192, 288)


  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()

  let render = await newRender({
    prompt,
    negativePrompt,
    identityImage,
    nbFrames: 1,
    nbFPS: 1,
    nbSteps: turbo ? 8 : 25,
    width,
    height,
    turbo,
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
