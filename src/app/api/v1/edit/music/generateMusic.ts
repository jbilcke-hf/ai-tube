
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapSegmentCategory,
  ClapSegmentStatus,
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


  // unconfirmed, I think some durations might make musicgen crash
  // File "/home/user/app/audiocraft/modules/transformer.py", line 394, in forward
  //   k, v = self._complete_kv(k, v)
  // File "/home/user/app/audiocraft/modules/transformer.py", line 286, in _complete_kv
  // assert nk.shape[time_dim] == nv.shape[time_dim]
  //
  // it is also possible that it was because I tried to generate on the prod,
  // while users where already using the musicgen cluster

  const durationInSec = 16 // musicSegment.assetDurationInMs / 1000

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

  let { durationInMs, hasAudio } = await getMediaInfo(assetUrl)

  const newProperties: Partial<ClapSegment> = {
    assetUrl,
    assetDurationInMs: durationInMs,
    assetSourceType: getClapAssetSourceType(assetUrl),
    outputGain: 1.0,
    status: ClapSegmentStatus.COMPLETED,
  }

  if (!hasAudio) {
    console.warn(`generateMusic(): the generated music waveform appears to be silent (might be a ffprobe malfunction)`)
    // return
    // we have a bug on AiTube, basically the ffmpeg probe isn't working,
    // because it doesn't find ffmpeg
    // if think the issue is how the Dockerfile is formed
    // so until this is fixed, we need to fake a "correct" result
    newProperties.assetDurationInMs = musicSegment.assetDurationInMs
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
