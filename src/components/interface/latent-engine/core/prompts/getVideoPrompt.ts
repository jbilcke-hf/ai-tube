import { ClapEntity, ClapSegment } from "@aitube/clap"

import { deduplicatePrompt } from "../../utils/prompting/deduplicatePrompt"

import { getCharacterPrompt } from "./getCharacterPrompt"

/**
 * Construct a video prompt from a list of active segments
 * 
 * @param segments 
 * @returns 
 */
export function getVideoPrompt(
  segments: ClapSegment[] = [],
  entitiesIndex: Record<string, ClapEntity> = {},
  extraPositivePrompt: string[] = []
): string {

  // console.log("entitiesIndex:", entitiesIndex)

  // to construct the video we need to collect all the segments describing it
  // we ignore unrelated categories (music, dialogue) or non-prompt items (eg. an audio sample)
  const tmp = segments
    .filter(({ category, outputType }) => {
      if (outputType === "audio") {
        return false
      }

      if (category === "music" ||
          category === "sound") {
        return false
      }

      if (category === "event" ||
          category === "interface" ||
          category === "phenomenon"
      ) {
        return false
      }
      
      if (category === "splat" ||
          category === "mesh" ||
          category === "depth"
      ) {
        return false
      }

      if (category === "storyboard" ||
          category === "video") {
        return false
      }

      if (category === "transition") {
        return false
      }

      return true
    })

  tmp.sort((a, b) => b.label.localeCompare(a.label))

  let videoPrompt = tmp.map(segment => {
    const entity: ClapEntity | undefined = entitiesIndex[segment?.entityId || ""] || undefined
    
    if (segment.category === "dialogue") {

      // if we can't find the entity, then we are unable
      // to make any assumption about the gender, age or appearance
      if (!entity) {
        console.log("ERROR: this is a dialogue, but couldn't find the entity!")
        return `portrait of a person speaking, blurry background, bokeh`
      }

      const characterTrigger = entity?.triggerName || ""
      const characterLabel = entity?.label || ""
      const characterDescription = entity?.description || ""
      const dialogueLine = segment?.prompt || ""
     
      const characterPrompt = getCharacterPrompt(entity)

      // in the context of a video, we some something additional:
      // we create a "bokeh" style
      return `portrait of a person speaking, blurry background, bokeh, ${characterPrompt}`
      
    } else if (segment.category === "location") {
  
      // if we can't find the location's entity, we default to returning the prompt
      if (!entity) {
        console.log("ERROR: this is a location, but couldn't find the entity!")
        return segment.prompt
      }

      return entity.description
    } else {
      return segment.prompt
    }
  }).filter(x => x)

  videoPrompt = videoPrompt.concat([
    ...extraPositivePrompt
  ])

  return deduplicatePrompt(videoPrompt.join(", "))
}