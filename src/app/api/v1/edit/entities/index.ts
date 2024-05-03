
import { ClapProject, getClapAssetSourceType, newClap } from "@aitube/clap"

import { generateImageID } from "./generateImageID"
import { generateAudioID } from "./generateAudioID"

import { ClapCompletionMode } from "../types"

export async function editEntities({
  existingClap,
  newerClap,
  mode
}: {
  existingClap: ClapProject
  newerClap: ClapProject
  mode: ClapCompletionMode
}) {

  if (!existingClap.entities.length) { throw new Error(`please provide at least one entity`) }

  for (const entity of existingClap.entities) {

    let entityHasBeenModified = false

    // TASK 1: GENERATE THE IMAGE PROMPT IF MISSING
    if (!entity.imagePrompt) {
      entity.imagePrompt = "a man with a beard"
      entityHasBeenModified = true
    }

    // TASK 2: GENERATE THE IMAGE ID IF MISSING
    if (!entity.imageId) {
      entity.imageId = await generateImageID({
        prompt: entity.imagePrompt,
        seed: entity.seed
      })
      entity.imageSourceType = getClapAssetSourceType(entity.imageId)
      entityHasBeenModified = true
    }

    // TASK 3: GENERATE THE AUDIO PROMPT IF MISSING
    if (!entity.audioPrompt) {
      entity.audioPrompt = "a man with a beard"
      entityHasBeenModified = true
    }

    // TASK 4: GENERATE THE AUDIO ID IF MISSING

    // TODO here: call Parler-TTS or a generic audio generator
    if (!entity.audioId) {
      entity.audioId = await generateAudioID({
        prompt: entity.audioPrompt,
        seed: entity.seed
      })
      entity.audioSourceType = getClapAssetSourceType(entity.audioId)
      entityHasBeenModified = true
    }

    // in case we are doing a partial update
    if (mode === "partial" && entityHasBeenModified && !newerClap.entityIndex[entity.id]) {
      newerClap.entities.push(entity)
      newerClap.entityIndex[entity.id] = entity
    }
  }

  console.log(`[api/edit/entities] returning the newerClap`)

  return newerClap
}
