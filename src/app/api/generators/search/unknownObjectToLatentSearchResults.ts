import { generateSeed } from "@aitube/clap"

import { parseTrimmedString } from "../../parsers/parseTrimmedString"
import { parseStringArray } from "../../parsers/parseStringArray"
import { LatentSearchResult, LatentSearchResults } from "./types"

export function unknownObjectToLatentSearchResults(something: any): LatentSearchResults {
  let results: LatentSearchResults = []

  if (Array.isArray(something)) {
    results = something.map(thing => ({
      label: parseTrimmedString(thing && (thing?.label || thing?.title)),
      summary: parseTrimmedString(thing && (thing?.summary || thing?.description || thing?.synopsis)),
      thumbnail: parseTrimmedString(thing && (thing?.thumbnail)),
      tags: parseStringArray(thing && (thing?.tag)),
      seed: generateSeed(), // a seed is necessary for consistency between search results and viewer
    } as LatentSearchResult))
  }

  return results
}