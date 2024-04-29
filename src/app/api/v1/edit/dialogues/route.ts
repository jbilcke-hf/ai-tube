import { NextResponse, NextRequest } from "next/server"

import { ClapEntity, ClapProject, ClapSegment, getClapAssetSourceType, newSegment, parseClap, serializeClap } from "@aitube/clap"

import { startOfSegment1IsWithinSegment2 } from "@/lib/utils/startOfSegment1IsWithinSegment2"
import { getToken } from "@/app/api/auth/getToken"

import { getSpeechBackgroundAudioPrompt } from "@/components/interface/latent-engine/core/prompts/getSpeechBackgroundAudioPrompt"
import { getSpeechForegroundAudioPrompt } from "@/components/interface/latent-engine/core/prompts/getSpeechForegroundAudioPrompt"
import { generateSpeechWithParlerTTS } from "@/app/api/generators/speech/generateVoiceWithParlerTTS"

// a helper to generate speech for a Clap
export async function POST(req: NextRequest) {

  const jwtToken = await getToken({ user: "anonymous" })

  const blob = await req.blob()

  const clap: ClapProject = await parseClap(blob)

  if (!clap?.segments) { throw new Error(`no segment found in the provided clap!`) }
  
  console.log(`[api/generate/dialogues] detected ${clap.segments.length} segments`)
  
  const shotsSegments: ClapSegment[] = clap.segments.filter(s => s.category === "camera")
  console.log(`[api/generate/dialogues] detected ${shotsSegments.length} shots`)
  
  if (shotsSegments.length > 32) {
    throw new Error(`Error, this endpoint being synchronous, it is designed for short stories only (max 32 shots).`)
  }

  
  for (const shotSegment of shotsSegments) {

    const shotSegments: ClapSegment[] = clap.segments.filter(s =>
      startOfSegment1IsWithinSegment2(s, shotSegment)
    )

    const shotDialogueSegments: ClapSegment[] = shotSegments.filter(s =>
      s.category === "dialogue"
    )

    let shotDialogueSegment: ClapSegment | undefined = shotDialogueSegments.at(0)
    
    console.log(`[api/generate/dialogues] shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotDialogueSegments.length} dialogues)`)

    if (shotDialogueSegment && !shotDialogueSegment.assetUrl) {
      console.log(`[api/generate/dialogues] generating audio..`)

      try {
        shotDialogueSegment.assetUrl = await generateSpeechWithParlerTTS({
          text: shotDialogueSegment.prompt,
          audioId: getSpeechBackgroundAudioPrompt(shotSegments, clap.entityIndex, ["high quality", "crisp", "detailed"]),
          debug: true,
        })
        shotDialogueSegment.assetSourceType = getClapAssetSourceType(shotDialogueSegment.assetUrl)

        console.log("TODO julian: properly set the asset type format")

      } catch (err) {
        console.log(`[api/generate/dialogues] failed to generate audio: ${err}`)
        throw err
      }
   
      console.log(`[api/generate/dialogues] generated dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)
    } else {
      console.log(`[api/generate/dialogues] there is already a dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)
    }
  }

  console.log(`[api/generate/dialogues] returning the clap augmented with dialogues`)

  return new NextResponse(await serializeClap(clap), {
    status: 200,
    headers: new Headers({ "content-type": "application/x-gzip" }),
  })
}
