
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
import { generateMusicWithMusicgen } from "@/app/api/generators/music/generateMusicWithMusicgen"

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
  const prompt = musicSegment.prompt
  if (!prompt) {
    console.log(`generateMusic(): music prompt is empty, so skipping music generation.`)
    return
  }

  const assetUrl = await generateMusicWithMusicgen({
    prompt,
    durationInSec: 10,
    hd: false,
    debug: true,
    neverThrow: true,
  })

  if (!assetUrl || assetUrl?.length < 30) {
    console.log(`generateMusic(): generated assetUrl is empty, so music generation failed.`)
    return
  }

  if (mode !== ClapCompletionMode.FULL) {
    console.log(`generateMusic(): adding music to a new clap file`)
    newerClap.segments.push(newSegment({
      ...musicSegment,
      assetUrl,
    }))
  } else {
    console.log(`generateMusic(): overwriting the music inside the existing clap file`)
    // this will replace the existing clap (normally)
    musicSegment.assetUrl = assetUrl
  }
}
