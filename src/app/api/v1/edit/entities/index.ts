
import { ClapProject, ClapSegmentCategory, getClapAssetSourceType, getValidNumber, newEntity } from "@aitube/clap"
import { ClapCompletionMode, ClapEntityPrompt } from "@aitube/client"

import { generateImageID } from "./generateImageID"
import { generateAudioID } from "./generateAudioID"
import { generateEntityPrompts } from "./generateEntityPrompts"
import { clapToLatentStory } from "./clapToLatentStory"

export async function editEntities({
  existingClap,
  newerClap,
  entityPrompts = [],
  mode = ClapCompletionMode.PARTIAL,
  turbo = false,
}: {
  existingClap: ClapProject
  newerClap: ClapProject
  entityPrompts?: ClapEntityPrompt[]
  mode?: ClapCompletionMode
  turbo?: boolean
}) {

  // note that we can only handle either FULL or PARTIAL
  // other modes such as MERGE, REPLACE.. are irrelevant since those are client-side modes
  // so from a server point of view those correspond to PARTIAL
  //
  // it is also worth noting that the use of FULL should be discouraged
  const isFull = mode === ClapCompletionMode.FULL
  const isPartial = !isFull

  // if we don't have existing entities, and user passed none,
  // then we need to hallucinate them
  if (existingClap.entities.length === 0 && entityPrompts.length === 0) {

    const entityPromptsWithShots = await generateEntityPrompts({
      prompt: existingClap.meta.description,
      latentStory: await clapToLatentStory(existingClap),
      turbo,
    })

    const allShots = existingClap.segments.filter(s => s.category === ClapSegmentCategory.CAMERA)

    for (const {
      entityPrompt: { name, category, age, variant, region, identityImage, identityVoice },
      shots: entityShots
    } of entityPromptsWithShots) {
      const newEnt = newEntity({
        category,
        triggerName: name,
        label: name,
        description: name,
        author: "auto",
        thumbnailUrl: "",
  
        imagePrompt: "",
        imageSourceType: getClapAssetSourceType(identityImage),
        imageEngine: "SDXL Lightning", 
        imageId: identityImage,
        audioPrompt: "",
        audioSourceType: getClapAssetSourceType(identityVoice),
        audioEngine: "Parler-TTS", // <- TODO: use OpenVoice 2, that way it can be personalized
        audioId: identityVoice,
  
        // note: using a numeric age should be deprecated,
        // instead we should be able to specify things using text,
        // eg. "8 months", "25 years old", "12th century"
        age: getValidNumber(age, 0, 120, 25),
   
        // TODO: delete gender and appearance, replace by a single concept of "variant"
        gender: "",
        appearance: variant,
        region: region,
      })
      
      existingClap.entities.push(newEnt)

      // now let's assign our entity to shots!
      //
      // warning: the shot assignment is the responsibility of the LLM.
      // if the LLM hallucinates non-existing shot ids, it will cause trouble!
      for (const shotId of entityShots) {
        if (allShots[shotId]) {
          allShots[shotId].entityId = newEnt.id
        } else {
          console.log(`[api/v1/edit/entities] warning: the LLM generated a non-existing shot (shot "${shotId}", but we only have ${allShots.length} shots)`)
        }
      }
    }
  }

  // otherwise try to add what's new
  for (const { name, category, age, variant, region, identityImage, identityVoice } of entityPrompts) {
    const newEnt = newEntity({
      category,
      triggerName: name,
      label: name,
      description: name,
      author: "auto",
      thumbnailUrl: "",

      imagePrompt: "",
      imageSourceType: getClapAssetSourceType(identityImage),
      imageEngine: "SDXL Lightning", 
      imageId: identityImage,
      audioPrompt: "",
      audioSourceType: getClapAssetSourceType(identityVoice),
      audioEngine: "Parler-TTS", // <- TODO: use OpenVoice 2, that way it can be personalized
      audioId: identityVoice,

      // note: using a numeric age should be deprecated,
      // instead we should be able to specify things using text,
      // eg. "8 months", "25 years old", "12th century"
      age: getValidNumber(age, 0, 120, 25),
 
      // TODO: delete gender and appearance, replace by a single concept of "variant"
      gender: "",
      appearance: variant,
      region: region,
    })
    
    existingClap.entities.push(newEnt)
  }

  if (!existingClap.entities.length) { throw new Error(`please provide at least one entity`) }

  // then we try to automatically repair, edit, complete.. all the existing entities

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
        seed: entity.seed,
        turbo,
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
    if (mode !== ClapCompletionMode.FULL && entityHasBeenModified && !newerClap.entityIndex[entity.id]) {
      newerClap.entities.push(entity)
      newerClap.entityIndex[entity.id] = entity
    }
  }

  console.log(`api/edit/entities(): returning the newerClap`)

  return newerClap
}
