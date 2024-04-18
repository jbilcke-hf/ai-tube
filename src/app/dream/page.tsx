

import { LatentQueryProps } from "@/types/general"

import { Main } from "../main"
import { searchResultToMediaInfo } from "../api/generators/search/searchResultToMediaInfo"
import { LatentSearchResult } from "../api/generators/search/types"

export default async function DreamPage({ searchParams: {
  l: latentContent,
} }: LatentQueryProps) {

  const latentSearchResult = JSON.parse(atob(`${latentContent}`)) as LatentSearchResult

  // this will hallucinate the thumbnail on the fly - maybe we should cache it
  const latentMedia = await searchResultToMediaInfo(latentSearchResult)

  return (
    <Main publicMedia={latentMedia} />
   )
}