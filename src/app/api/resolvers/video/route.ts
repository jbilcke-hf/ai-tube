import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { createSecretKey } from "crypto"
import { jwtVerify } from "jose"

import { generateSeed } from "@aitube/clap"

import { newRender, getRender } from "../../providers/videochain/renderWithVideoChain"
import { sleep } from "@/lib/utils/sleep"
import { getNegativePrompt, getPositivePrompt } from "../../utils/imagePrompts"
import { getContentType } from "@/lib/data/getContentType"
import { whoAmI, WhoAmIUser } from "@huggingface/hub"
import { getValidNumber } from "@/lib/utils/getValidNumber"

const secretKey = createSecretKey(`${process.env.API_SECRET_JWT_KEY || ""}`, 'utf-8');

export async function GET(req: NextRequest) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  /*
  TODO Julian: check the validity of the JWT token
  let token = ""
  try {
    token = decodeURIComponent(query?.t?.toString() || "").trim()

    // verify token
    const { payload, protectedHeader } = await jwtVerify(token, secretKey, {
      issuer: `${process.env.API_SECRET_JWT_ISSUER || ""}`, // issuer
      audience: `${process.env.API_SECRET_JWT_AUDIENCE || ""}`, // audience
    });
      // log values to console
      console.log(payload);
      console.log(protectedHeader);
  } catch (err) {
    // token verification failed
    console.log("Token is invalid");
    return NextResponse.json({ error: `access denied ${err}` }, { status: 400 });
  }
  */
  console.log("[API] /api/resolvers/video")

  let prompt = ""
  try {
    prompt = decodeURIComponent(query?.p?.toString() || "").trim()
  } catch (err) {}

  if (!prompt) {
    return NextResponse.json({ error: 'no prompt provided' }, { status: 400 });
  }

  let width = 512
  try {
    const rawString = decodeURIComponent(query?.w?.toString() || "").trim()
    width = getValidNumber(rawString, 256, 8192, 512)
  } catch (err) {}

  let height = 288
  try {
    const rawString = decodeURIComponent(query?.h?.toString() || "").trim()
    height = getValidNumber(rawString, 256, 8192, 288)
  } catch (err) {}


  let format = "binary"
  try {
    const f = decodeURIComponent(query?.f?.toString() || "").trim()
    if (f === "json" || f === "binary") { format = f }
  } catch (err) {}
  
  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()


  console.log("calling await newRender with", {
    prompt,
    negativePrompt,
  })

  throw new Error("no! use render()!")
  let render = await newRender({
    prompt,
    negativePrompt,
    
    // ATTENTION: changing those will slow things to 5-6s of loading time (compared to 3-4s)
    // and with no real visible change

    // ATTENTION! if you change those values,
    // please make sure that the backend API can support them,
    // and also make sure to update the Zustand store values in the frontend:
    // videoModelFPS: number
    // videoModelNumOfFrames: number
    // videoModelDurationInSec: number
    //
    // note: internally, the model can only do 16 frames at 10 FPS
    // (1.6 second of video)
    // but I have added a FFmpeg interpolation step, which adds some
    // overhead (2-3 secs) but at least can help smooth things out, or make
    // them artificially longer

    // those settings are pretty good, takes about 2.9,, 3.1 seconds to compute
    // represents 3 secs of 16fps
  

    // with those parameters, we can generate a 2.584s long video at 24 FPS
    // note that there is a overhead due to smoothing,
    // on the A100 it takes betwen 5.3 and 7 seconds to compute
    // although it will appear a bit "slo-mo"
    // since the original is a 1.6s long video at 10 FPS
    nbFrames: 80,
    nbFPS: 24,

    
    // nbFrames: 48,
    // nbFPS: 24,

    // it generated about:
    // 24 frames
    // 2.56s run time

    // possibles values are 1, 2, 4, and 8
    // but with 2 steps the video "flashes" and it creates monstruosity
    // like fishes with 2 tails etc
    // and with 8 steps I don't see much improvements with 8 to be honest
    nbSteps: 4,

    // this corresponds roughly to 16:9
    // which is the aspect ratio video used by AiTube

    // unfortunately, this is too compute intensive,
    // and it creates monsters like two-headed fishes
    // (although this artifact could probably be fixed with more steps,
    // but we cannot afford those)
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
    width,
    height,

    // we save about 500ms if we go below,
    // but there we will be some deformed artifacts as the model
    // doesn't perform well below 512px
    // it also makes things more "flashy"
    // width: 456, // 512,
    // height: 256, // 288,

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
