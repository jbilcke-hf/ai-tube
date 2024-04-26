import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { parseClap, serializeClap, ClapModel } from "@aitube/clap"
import { getToken } from "@/app/api/auth/getToken"

import { generateImageID } from "./generateImageID"
import { generateAudioID } from "./generateAudioID"

export async function POST(req: NextRequest) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  // TODO: use query parameters to determine *what* to generate:
  /*
  let prompt = ""
  try {
    prompt = decodeURIComponent(query?.p?.toString() || "").trim()
  } catch (err) {}
  if (!prompt) {
    return NextResponse.json({ error: 'no prompt provided' }, { status: 400 });
  }

  if (!prompt.length) { throw new Error(`please provide a prompt`) }
  */

  console.log("[api/generate/models] request:", prompt)

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const clap = await parseClap(blob)

  if (!clap.models.length) { throw new Error(`please provide at least one model`) }

  for (const model of clap.models) {

    // TASK 1: GENERATE THE IMAGE PROMPT IF MISSING
    if (!model.imagePrompt) {
      model.imagePrompt = "a man with a beard"
    }

    // TASK 2: GENERATE THE IMAGE ID IF MISSING
    if (!model.imageId) {
      model.imageId = await generateImageID({
        prompt: model.imagePrompt,
        seed: model.seed
      })
    }

    // TASK 3: GENERATE THE AUDIO PROMPT IF MISSING
    if (!model.audioPrompt) {
      model.audioPrompt = "a man with a beard"
    }

    // TASK 4: GENERATE THE AUDIO ID IF MISSING

    // TODO here: call Parler-TTS or a generic audio generator
    if (!model.audioId) {
      model.audioId = await generateAudioID({
        prompt: model.audioPrompt,
        seed: model.seed
      })
    }
  }

  console.log(`[api/generate/models] returning the clap extended with the model`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
