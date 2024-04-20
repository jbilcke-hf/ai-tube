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
  
  // console.log("calling await newRender")
  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()

  let render = await newRender({
    prompt,
    negativePrompt,
    nbFrames: 1,
    nbFPS: 1,
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

    await sleep(2000) // minimum wait time

    // console.log("asking getRender")
    render = await getRender(render.renderId)
  }

  return NextResponse.json({
    "error": "failed to call VideoChain (timeout expired)"
  }, {
    status: 500,
  })
}
