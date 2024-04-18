import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { newRender, getRender } from "../../providers/videochain/renderWithVideoChain"
import { generateSeed } from "@/lib/utils/generateSeed"
import { sleep } from "@/lib/utils/sleep"
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

  // console.log("calling await newRender")

  let render = await newRender({
    prompt,
    negativePrompt: "blurry, cropped, bad quality",
    nbFrames: 1,
    nbSteps: 4,
    width: 1024,
    height: 576,
    turbo: true,
    shouldRenewCache: true,
    seed: generateSeed()
  })

  let attempts = 20

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

    await sleep(2000) // minimum wait time

    console.log("asking getRender")
    render = await getRender(render.renderId)
  }

  return NextResponse.json({ error: 'failed to call VideoChain (timeout expired)' }, { status: 500 });
}
