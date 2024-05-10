
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapSegmentCategory,
  newSegment
} from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"
import { getSpeechBackgroundAudioPrompt } from "@aitube/engine"

import { generateSpeechWithParlerTTS } from "@/app/api/generators/speech/generateVoiceWithParlerTTS"
import { getMediaInfo } from "@/app/api/utils/getMediaInfo"
import { generateMusicWithMusicgen } from "@/app/api/v1/edit/music/generateMusicWithMusicgen"

export async function generateMusic({
  musicSegment,
  existingClap,
  newerClap,
  mode,
  turbo,
}: {
  musicSegment?: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
  turbo: boolean
}): Promise<void> {
  if (!musicSegment) {
    console.log(`generateMusic(): music segment is empty, so skipping music generation.`)
    return
  }

    // for now we do something very basic

  if (musicSegment.status === "completed") {
    console.log(`generateMusic(): music segment is already generated, skipping doing it twice.`)
    return
  }
  
  // for now we do something very basic
  const prompt = musicSegment.prompt
  if (!prompt) {
    console.log(`generateMusic(): music prompt is empty, so skipping music generation.`)
    return
  }

  const durationInSec = 10 // musicSegment.assetDurationInMs / 1000

  console.log(`generateMusic(): generating a music with:\n  duration: ${durationInSec} sec\n  prompt: ${prompt}`)

  const assetUrl = await generateMusicWithMusicgen({
    prompt,
    durationInSec,
    hd: false,
    debug: true,
    neverThrow: true,
  })


  if (!assetUrl || assetUrl?.length < 30) {
    console.log(`generateMusic(): the generated assetUrl is empty, so music generation failed.`)
    return
  }

  const { durationInMs, hasAudio } = await getMediaInfo(assetUrl)
  
  if (!hasAudio) {
    console.log(`generateMusic(): the generated music waveform is silent, so music generation failed.`)
    return
  }

  const newProperties: Partial<ClapSegment> = {
    assetUrl,
    assetDurationInMs: durationInMs,
    outputGain: 1.0,
    status: "completed"
  }

  if (mode !== ClapCompletionMode.FULL) {
    console.log(`generateMusic(): adding music to a new clap file`)
    newerClap.segments.push(newSegment({
      ...musicSegment,
      ...newProperties,
    }))
  } else {
    console.log(`generateMusic(): overwriting the music inside the existing clap file`)
    // this will update the existing clap (normally)
    Object.assign(musicSegment, newProperties)
  }
}
