
import { ClapProject, ClapSegment, getClapAssetSourceType } from "@aitube/clap"
import { getSpeechBackgroundAudioPrompt } from "@aitube/engine"

import { startOfSegment1IsWithinSegment2 } from "@/lib/utils/startOfSegment1IsWithinSegment2"
import { generateSpeechWithParlerTTS } from "@/app/api/generators/speech/generateVoiceWithParlerTTS"
import { getMediaInfo } from "@/app/api/utils/getMediaInfo"

export async function processShot({
  shotSegment,
  clap
}: {
  shotSegment: ClapSegment
  clap: ClapProject
}): Promise<void> {

  const shotSegments: ClapSegment[] = clap.segments.filter(s =>
    startOfSegment1IsWithinSegment2(s, shotSegment)
  )

  const shotDialogueSegments: ClapSegment[] = shotSegments.filter(s =>
    s.category === "dialogue"
  )

  let shotDialogueSegment: ClapSegment | undefined = shotDialogueSegments.at(0)
  
  console.log(`[api/generate/dialogues] processShot: shot [${shotSegment.startTimeInMs}:${shotSegment.endTimeInMs}] has ${shotSegments.length} segments (${shotDialogueSegments.length} dialogues)`)

  if (shotDialogueSegment && !shotDialogueSegment.assetUrl) {
    // console.log(`[api/generate/dialogues] generating audio..`)

    try {
      // this generates a mp3
      shotDialogueSegment.assetUrl = await generateSpeechWithParlerTTS({
        text: shotDialogueSegment.prompt,
        audioId: getSpeechBackgroundAudioPrompt(shotSegments, clap.entityIndex, ["high quality", "crisp", "detailed"]),
        debug: true,
      })
      shotDialogueSegment.assetSourceType = getClapAssetSourceType(shotDialogueSegment.assetUrl)

      const { durationInMs, durationInSec, hasAudio } = await getMediaInfo(shotDialogueSegment.assetUrl)
      
      if (hasAudio && durationInMs > 1000) {
        shotDialogueSegment.assetDurationInMs = durationInMs
        shotSegment.assetDurationInMs = durationInMs

        // we update the duration of all the segments for this shot
        // (it is possible that this makes the two previous lines redundant)
        clap.segments.filter(s => {
          s.assetDurationInMs = durationInMs
        })
      }

    } catch (err) {
      console.log(`[api/generate/dialogues] processShot: failed to generate audio: ${err}`)
      throw err
    }

    console.log(`[api/generate/dialogues] processShot: generated dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)
  } else {
    console.log(`[api/generate/dialogues] processShot: there is already a dialogue audio: ${shotDialogueSegment?.assetUrl?.slice?.(0, 50)}...`)
  }
}
