import { HfInference, HfInferenceEndpoint } from '@huggingface/inference'
import { getValidNumber } from "@aitube/clap"

import { getNegativePrompt, getPositivePrompt } from "@/app/api/utils/imagePrompts"
import { adminApiKey } from '@/app/api/actions/config'

export async function generateStoryboardWithFlux({
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
  
  width = getValidNumber(width, 256, 2048, 512)
  height = getValidNumber(height, 256, 2048, 288)


  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()


  const hf: HfInferenceEndpoint = new HfInference(
    adminApiKey
  )

  const blob: Blob = await hf.textToImage({
    model: 'black-forest-labs/FLUX.1-schnell',
    inputs: prompt,
    parameters: {
      height,
      width,
      // seed: seed || generateSeed(),

      // this triggers the following exception:
      // Error: __call__() got an unexpected keyword argument 'negative_prompt'
      // negative_prompt: negativePrompt,

      /**
       * The number of denoising steps. More denoising steps usually lead to a higher quality image at the expense of slower inference.
       */
      // num_inference_steps?: number;
      /**
       * Guidance scale: Higher guidance scale encourages to generate images that are closely linked to the text `prompt`, usually at the expense of lower image quality.
       */
      // guidance_scale?: number;
    },
  })


  const buffer = Buffer.from(await blob.arrayBuffer())

  return `data:${blob.type || 'image/jpeg'};base64,${buffer.toString('base64')}`
}
