import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { newRender, getRender } from "../../providers/videochain/renderWithVideoChain"
import { generateSeed } from "@/lib/utils/generateSeed"
import { sleep } from "@/lib/utils/sleep"
import { getNegativePrompt, getPositivePrompt } from "../../utils/imagePrompts"
import { getContentType } from "@/lib/data/getContentType"

export async function GET(req: NextRequest) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query


  let prompt = ""
  try {
    prompt = decodeURIComponent(query?.p?.toString() || "").trim()
  } catch (err) {}

  if (!prompt) {
    return NextResponse.json({ error: 'no prompt provided' }, { status: 400 });
  }

  let format = "binary"
  try {
    const f = decodeURIComponent(query?.f?.toString() || "").trim()
    if (f === "json" || f === "binary") { format = f }
  } catch (err) {}
  
  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()

  // console.log("calling await newRender")

  let render = await newRender({
    prompt,
    negativePrompt,
    
    // ATTENTION: changing those will slow things to 5-6s of loading time (compared to 3-4s)
    // and with no real visible change

    nbFrames: 20, // apparently the model can only do 2 seconds at 10, so be it

    nbFPS: 10,

    // possibles values are 1, 2, 4, and 8
    // but I don't see much improvements with 8 to be honest
    // the best one seems to be 4
    nbSteps: 4,

    // this corresponds roughly to 16:9
    // which is the aspect ratio video used by AiTube

    // unfortunately, this is too compute intensive, so we have to take half of that
    // width: 1024,
    // height: 576,

    // IMPORTANT: since we use the tailwind class aspect-video,
    // you cannot use use anything here!
    // this must be aligned with whatever you choose in the frontend UI
    //
    // if you don't do this:
    // - that's pixel waste, you are rendering some area for nothing (and on this project each pixel is a precious nanosecond)
    // - clicks won't be aligned with the video, so segmentation will be off
    // eg you cannot use 1024x512 or 512x256, because that's not aspect-video
    // (you would have to create an entry in the tailwind config to do that properly)
    //
    // that's not the only constraint: you also need to respect this:
    // `height` and `width` have to be divisible by 8 (use 32 to be safe)
    // width: 512,
    // height: 288,
    width: 456, // 512,
    height: 256, // 288,

    turbo: true, // without much effect for videos as of now, as we only supports turbo (AnimateDiff Lightning)
    shouldRenewCache: true,
    seed: generateSeed()
  })

  let attempts = 10

  while (attempts-- > 0) {
    if (render.status === "completed") {
      if (format === "json") {
        return NextResponse.json(render, {
          status: 200,
          statusText: "OK",
        })
       } else {
        const contentType = getContentType(render.assetUrl)
        const base64String = render.assetUrl.split(";base64,").pop() || ""
        const data = Buffer.from(base64String, "base64")
        const headers = new Headers()
        headers.set('Content-Type', contentType)
        return new NextResponse(data, {
          status: 200,
          statusText: "OK",
          headers
        })
      }
    }

    if (render.status === "error") {
      return NextResponse.json(render, {
        status: 200,
        statusText: "OK",
      })
    }

    await sleep(1000) // minimum wait time

    // console.log("asking getRender")
    render = await getRender(render.renderId)
  }

  return NextResponse.json({ error: 'failed to call VideoChain (timeout expired)' }, { status: 500 });
}
