import { parseStringArray } from "../../parsers/parseStringArray"
import { LatentScene, LatentScenes } from "./types"

/**
 * Process a YAML result from the LLM to make sure it is a LatentScenes
 * 
 * @param something 
 * @returns
 */
export function unknownObjectToLatentScenes(something: any): LatentScenes {
  let scenes: LatentScenes = []
  if (Array.isArray(something)) {
    scenes = something.map(thing => ({
      characters: parseStringArray(thing && (thing?.characters || thing?.character)),
      locations: parseStringArray(thing && (thing?.locations || thing?.location)),
      actions: parseStringArray(thing && (thing?.actions || thing?.action)),
    } as LatentScene))
  }
  return scenes
}