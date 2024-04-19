import { generateSeed } from "@/lib/utils/generateSeed"
import { parseString } from "../../utils/parseString"
import { parseStringArray } from "../../utils/parseStringArray"
import { LatentSearchResult, LatentSearchResults } from "./types"

export function unknownObjectToLatentSearchResults(something: any): LatentSearchResults {
  let results: LatentSearchResults = []

  if (Array.isArray(something)) {
    results = something.map(thing => ({
      label: parseString(thing && (thing?.label || thing?.title)),
      summary: parseString(thing && (thing?.summary || thing?.description || thing?.synopsis)),
      thumbnail: parseString(thing && (thing?.thumbnail)),
      tags: parseStringArray(thing && (thing?.tag)),
      seed: generateSeed(), // a seed is necessary for consistency between search results and viewer
    } as LatentSearchResult))
  }

  return results
}