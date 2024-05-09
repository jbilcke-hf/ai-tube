
import {
  ClapProject,
  ClapSegment,
  getClapAssetSourceType,
  filterSegments,
  ClapSegmentFilteringMode,
  ClapSegmentCategory
} from "@aitube/clap"
import { ClapCompletionMode } from "@aitube/client"
import { getSpeechBackgroundAudioPrompt } from "@aitube/engine"

import { generateSpeechWithParlerTTS } from "@/app/api/generators/speech/generateVoiceWithParlerTTS"
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
  
  const shotDialogueSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === ClapSegmentCategory.DIALOGUE
  )

  let shotDialogueSegment: ClapSegment | undefined = shotDialogueSegments.at(0)
  
  console.log(`[api/edit/dialogues] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotDialogueSegments.length} dialogues)`)

  if (shotDialogueSegment && !shotDialogueSegment.assetUrl) {
    // console.log(`[api/edit/dialogues] generating audio..`)

    try {
      // this generates a mp3
      shotDialogueSegment.assetUrl = await generateSpeechWithParlerTTS({
        text: shotDialogueSegment.prompt,
        audioId: getSpeechBackgroundAudioPrompt(
          shotSegments,
          existingClap.entityIndex,
          // TODO: use the entity description if it exists
          ["high quality", "crisp", "detailed"]
        ),
        debug: true,
      })
      shotDialogueSegment.assetSourceType = getClapAssetSourceType(shotDialogueSegment.assetUrl)

      const { durationInMs, durationInSec, hasAudio } = await getMediaInfo(shotDialogueSegment.assetUrl)
      
      if (hasAudio && durationInMs > 1000) {
        shotDialogueSegment.assetDurationInMs = durationInMs
        shotSegment.assetDurationInMs = durationInMs

        // we update the duration of all the segments for this shot
        // (it is possible that this makes the two previous lines redundant)
        existingClap.segments.forEach(s => {
          s.assetDurationInMs = durationInMs
        })
      }

    } catch (err) {
      console.log(`[api/edit/dialogues] processShot: failed to generate audio: ${err}`)
      throw err
    }

    console.log(`[api/edit/dialogues] processShot: generated dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)

  // if it's partial, we need to manually add it
  if (mode !== ClapCompletionMode.FULL) {
      newerClap.segments.push(shotDialogueSegment)
    }
  } else {
    console.log(`[api/edit/dialogues] processShot: there is already a dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)
  }
}
