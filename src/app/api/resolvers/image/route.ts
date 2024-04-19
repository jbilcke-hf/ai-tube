import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { newRender, getRender } from "../../providers/videochain/renderWithVideoChain"
import { generateSeed } from "@/lib/utils/generateSeed"
import { sleep } from "@/lib/utils/sleep"

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

  // console.log("calling await newRender")

  let render = await newRender({
    prompt: `${prompt}, cinematic, photo, sublime, pro quality, sharp, crisp, beautiful, impressive, amazing, high quality, 4K`,
    negativePrompt: "logo, text, ui, hud, interface, buttons, ad, signature, copyright, blurry, cropped, bad quality",
    nbFrames: 1,
    nbSteps: 8,
    width: 1024,
    height: 576,
    turbo: true,
    shouldRenewCache: true,
    seed: generateSeed()
  })

  let attempts = 10

  while (attempts-- > 0) {
    if (render.status === "completed") {
      return NextResponse.json(render, {
        status: 200,
        statusText: "OK",
      })

    }

    if (render.status === "error") {
      return NextResponse.json(render, {
        status: 200,
        statusText: "OK",
      })
    }

    await sleep(1000) // minimum wait time

    console.log("asking getRender")
    render = await getRender(render.renderId)
  }

  return NextResponse.json({
    "error": "failed to call VideoChain (timeout expired)"
  }, {
    status: 500,
  })
}
