import { NextResponse, NextRequest } from "next/server"
import { createSecretKey } from "node:crypto"

import queryString from "query-string"

import { newRender, getRender } from "../../providers/videochain/renderWithVideoChain"
import { generateSeed } from "@/lib/utils/generateSeed"
import { sleep } from "@/lib/utils/sleep"
import { getNegativePrompt, getPositivePrompt } from "../../utils/imagePrompts"
import { getContentType } from "@/lib/data/getContentType"
import { getValidNumber } from "@/lib/utils/getValidNumber"

const secretKey = createSecretKey(`${process.env.API_SECRET_JWT_KEY || ""}`, 'utf-8');

export async function GET(req: NextRequest) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  /*
  TODO: check the validity of the JWT token
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
  
  // console.log("calling await newRender")
  prompt = getPositivePrompt(prompt)
  const negativePrompt = getNegativePrompt()

  let render = await newRender({
    prompt,
    negativePrompt,
    nbFrames: 1,
    nbFPS: 1,
    nbSteps: 8,
    width,
    height,
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
