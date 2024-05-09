import { generateSeed, getValidNumber } from "@aitube/clap"
import { getClusterMachine, token } from "./cluster"

export async function render(request: {
  prompt?: string
  seed?: number
  width?: number
  height?: number
  nbFrames?: number
  nbFPS?: number
  nbSteps?: number
  debug?: boolean
}): Promise<string> {
  
  const prompt = request.prompt || ""
  if (!prompt) {
    throw new Error(`missing prompt`)
  }
  
  const debug = !!request.debug

  const seed = request?.seed || generateSeed()
  
  // see https://huggingface.co/spaces/jbilcke-hf/ai-tube-model-animatediff-lightning/blob/main/app.py#L15-L18
  const baseModel = "epiCRealism"

  // the motion LoRA - could be useful one day
  const motion = ""

  // can be 1, 2, 4 or 8
  // but values below 4 look bad
  const nbSteps = getValidNumber(request.nbSteps, 1, 8, 4)
  const width = getValidNumber(request.width, 256, 1024, 512)
  const height = getValidNumber(request.height, 256, 1024, 288)

  const nbFrames = getValidNumber(request.nbFrames, 10, 120, 10)
  const nbFPS = getValidNumber(request.nbFPS, 10, 120, 10)

  // by default AnimateDiff generates about 2 seconds of video at 10 fps
  // the Gradio API now has some code to optional fix that using FFmpeg,
  // but this will add some delay overhead, so use with care!
  const durationInSec = Math.round(nbFrames / nbFPS)
  const framesPerSec = nbFPS

  const machine = await getClusterMachine()

  try {
    if (debug) {
      console.log(`calling AnimateDiff Lightning API with params (some are hidden):`, {
        baseModel,
        motion,
        nbSteps,
        width,
        height,
        nbFrames,
        nbFPS,
        durationInSec,
        framesPerSec,
      })
    }

    const res = await fetch(machine.url + (machine.url.endsWith("/") ? "" : "/") + "api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fn_index: 0, // <- important! it is currently 4, not 1!
        data: [
          token,
          prompt,
          baseModel,
          width,
          height,
          motion,
          nbSteps,
          durationInSec,
          framesPerSec,
        ],
      }),

      // necessary since we are using the fetch() provided by NextJS
      cache: "no-store",
      
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
    })

    // console.log("res:", res)

    const { data } = await res.json()

    // console.log("data:", data)
    // Recommendation: handle errors
    if (res.status !== 200 || !Array.isArray(data)) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error(`Failed to fetch data (status: ${res.status})`)
    }
    // console.log("data:", data.slice(0, 50))
  
    const base64Content = (data?.[0] || "") as string

    if (!base64Content) {
      throw new Error(`invalid response (no content)`)
    }

    // this API already emits a data-uri with a content type
    // addBase64HeaderToMp4(base64Content)
    return base64Content
  } catch (err) {
    if (debug) {
      console.error(`failed to call the AnimateDiff Lightning API:`)
      console.error(err)
    }
    throw err
  } finally {
    // important: we need to free up the machine!
    machine.busy = false
  }
}