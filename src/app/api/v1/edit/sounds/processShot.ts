
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapSegmentCategory,
  ClapSegmentStatus
} from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"

import { generateSoundWithMagnet } from "./generateSourceWithMagnet"
import { getMediaInfo } from "@/app/api/utils/getMediaInfo"

export async function processShot({
  shotSegment,
  existingClap,
  newerClap,
  mode,
  turbo,
}: {
  shotSegment: ClapSegment
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
  turbo: boolean
}): Promise<void> {

  const shotSegments: ClapSegment[] = filterSegments(
    ClapSegmentFilteringMode.BOTH,
    shotSegment,
    existingClap.segments
  )
  
  const shotSoundSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === ClapSegmentCategory.SOUND
  )

  let shotSoundSegment: ClapSegment | undefined = shotSoundSegments.at(0)
  
  console.log(`[api/edit/sounds] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotSoundSegments.length} sounds)`)

  if (shotSoundSegment && !shotSoundSegment.assetUrl) {
    // console.log(`[api/edit/sounds] generating background sound effect..`)

    try {
      // this generates a mp3
      shotSoundSegment.assetUrl = await generateSoundWithMagnet({
        prompt: shotSoundSegment.prompt,
        durationInSec: shotSegment.assetDurationInMs,
        hd: false,
        debug: true,
        neverThrow: false,
      })
      shotSoundSegment.assetSourceType = getClapAssetSourceType(shotSoundSegment.assetUrl)
      
      shotSoundSegment.status = ClapSegmentStatus.COMPLETED

      const { durationInMs, hasAudio } = await getMediaInfo(shotSoundSegment.assetUrl)
  
      if (hasAudio && durationInMs > 1000) {
        shotSoundSegment.assetDurationInMs = durationInMs
        shotSegment.assetDurationInMs = durationInMs

        // we update the duration of all the segments for this shot
        // (it is possible that this makes the two previous lines redundant)
        existingClap.segments.forEach(s => {
          s.assetDurationInMs = durationInMs
        })
      }

    } catch (err) {
      console.log(`[api/edit/sounds] processShot: failed to generate audio: ${err}`)
      throw err
    }

    console.log(`[api/edit/sounds] processShot: generated sound audio: ${shotSoundSegment?.assetUrl?.slice?.(0, 50)}...`)

  // if it's partial, we need to manually add it
  if (mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotSoundSegment)
    }
  } else {
    console.log(`[api/edit/sounds] processShot: there is already a sound audio: ${shotSoundSegment?.assetUrl?.slice?.(0, 50)}...`)
  }
}
