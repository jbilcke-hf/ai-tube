
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
import { ClapCompletionMode } from "@aitube/clap"
import { getMediaInfo } from "@/app/api/utils/getMediaInfo"
import { generateSoundWithMagnet } from "./generateSourceWithMagnet"

export async function generateSound({
  soundSegment,
  existingClap,
  newerClap,
  mode,
  turbo,
}: {
  soundSegment?: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
  turbo: boolean
}): Promise<void> {
  if (!soundSegment) {
    console.log(`generateSound(): sound segment is empty, so skipping sound generation.`)
    return
  }

    // for now we do something very basic

  if (soundSegment.status === "completed") {
    console.log(`generateSound(): sound segment is already generated, skipping doing it twice.`)
    return
  }
  
  // for now we do something very basic
  const prompt = soundSegment.prompt
  if (!prompt) {
    console.log(`generateSound(): sound prompt is empty, so skipping sound generation.`)
    return
  }


  const durationInSec = 12 // soundSegment.assetDurationInMs / 1000

  console.log(`generateSound(): generating a sound with:\n  duration: ${durationInSec} sec\n  prompt: ${prompt}`)

  const assetUrl = await generateSoundWithMagnet({
    prompt,
    durationInSec,
    hd: false,
    debug: true,
    neverThrow: true,
  })


  if (!assetUrl || assetUrl?.length < 30) {
    console.log(`generateSound(): the generated assetUrl is empty, so sound generation failed.`)
    return
  }

  let { durationInMs, hasAudio } = await getMediaInfo(assetUrl)

  const newProperties: Partial<ClapSegment> = {
    assetUrl,
    assetDurationInMs: durationInMs,
    outputGain: 1.0,
    status: ClapSegmentStatus.COMPLETED,
  }


  if (!hasAudio) {
    console.warn(`generateSound(): the generated sound waveform appears to be silent (might be a ffprobe malfunction)`)
    // return
    // we have a bug on AiTube, basically the ffmpeg probe isn't working,
    // because it doesn't find ffmpeg
    // if think the issue is how the Dockerfile is formed
    // so until this is fixed, we need to fake a "correct" result
    newProperties.assetDurationInMs = soundSegment.assetDurationInMs
  }

  if (mode !== ClapCompletionMode.FULL) {
    console.log(`generateSound(): adding sound to a new clap file`)
    newerClap.segments.push(newSegment({
      ...soundSegment,
      ...newProperties,
    }))
  } else {
    console.log(`generateSound(): overwriting the sound inside the existing clap file`)
    // this will update the existing clap (normally)
    Object.assign(soundSegment, newProperties)
  }
}
