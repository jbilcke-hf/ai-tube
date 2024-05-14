import { generateSeed, getValidNumber } from "@aitube/clap"
import { getClusterMachine, token } from "./cluster"
import { resizeImage } from "@/lib/utils/resizeImage"

/**
 * Render a video using AnimateDiff-LCM-SVD
 * 
 * @param request 
 * @returns 
 */
export async function render(request: {
  imageInputBase64?: string
  seed?: number
  width?: number
  height?: number
  nbFrames?: number
  nbFPS?: number
  nbSteps?: number
  debug?: boolean
}): Promise<string> {
  
  const imageInputBase64 = request.imageInputBase64 || ""
  if (!imageInputBase64) {
    throw new Error(`missing imageInputBase64`)
  }
  
  const debug = !!request.debug

  // I think we have a problem with the seed?
  // const seed = request?.seed || generateSeed()

  // the motion LoRA - could be useful one day
  const motion = ""

  const nbSteps = getValidNumber(request.nbSteps, 1, 12, 4)
  const width = getValidNumber(request.width, 256, 1024, 896)
  const height = getValidNumber(request.height, 256, 1024, 512)

  // important note: by default our AnimateDiff-LCM SVD
  // is a 24 fps model, so either 24 fps for 1 sec of footage,
  // or 8 fps for 3 seconds of footage
  const nbFrames = getValidNumber(request.nbFrames, 10, 120, 24)
  const nbFPS = getValidNumber(request.nbFPS, 10, 120, 8)

  // by default AnimateDiff generates about 2 seconds of video at 10 fps
  // the Gradio API now has some code to optional fix that using FFmpeg,
  // but this will add some delay overhead, so use with care!
  const durationInSec = Math.round(nbFrames / nbFPS)
  const framesPerSec = nbFPS

  // vital step: image size must match the output video size
  const resizedImageBase64 = await resizeImage({
    input: imageInputBase64,
    width,
    height,
    debug: true,
    asBase64: true
  })

  // console.log(`resizedImage: ${resizedImageBase64.slice(0, 64)}`)

  const machine = await getClusterMachine()

  try {
    if (debug) {
      console.log(`calling AnimateDiff-LCM-SVD API with params (some are hidden):`, {
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
          resizedImageBase64,
          0, // seed,
          true,
          33, // motion_bucket_id,

          // attention: we are experimenting with ffmpeg to change the speed,
          // on the server "als-2"
          // but only this server supports "durationInSec" as an extra parameter

          durationInSec,

          // same here, if using als-2 you need to pick a small value
          framesPerSec,

          1.2, // max_guidance_scale,
          1.0, // min_guidance_scale,
          width,
          height,
          nbSteps,
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
      console.error(`failed to call the AnimateDiff-LCM-SVD API:`)
      console.error(err)
    }
    throw err
  } finally {
    // important: we need to free up the machine!
    machine.busy = false
  }
}