import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"

import { getClapAssetSourceType, parseClap, serializeClap } from "@aitube/clap"
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

  console.log("[api/generate/entities] request:", prompt)

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const clap = await parseClap(blob)

  if (!clap.entities.length) { throw new Error(`please provide at least one entity`) }

  for (const entity of clap.entities) {

    // TASK 1: GENERATE THE IMAGE PROMPT IF MISSING
    if (!entity.imagePrompt) {
      entity.imagePrompt = "a man with a beard"
    }

    // TASK 2: GENERATE THE IMAGE ID IF MISSING
    if (!entity.imageId) {
      entity.imageId = await generateImageID({
        prompt: entity.imagePrompt,
        seed: entity.seed
      })
      entity.imageSourceType = getClapAssetSourceType(entity.imageId)
    }

    // TASK 3: GENERATE THE AUDIO PROMPT IF MISSING
    if (!entity.audioPrompt) {
      entity.audioPrompt = "a man with a beard"
    }

    // TASK 4: GENERATE THE AUDIO ID IF MISSING

    // TODO here: call Parler-TTS or a generic audio generator
    if (!entity.audioId) {
      entity.audioId = await generateAudioID({
        prompt: entity.audioPrompt,
        seed: entity.seed
      })
      entity.audioSourceType = getClapAssetSourceType(entity.audioId)
    }
  }

  console.log(`[api/generate/entities] returning the clap extended with the entities`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
