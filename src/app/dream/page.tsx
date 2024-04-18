

import { LatentQueryProps } from "@/types/general"

import { Main } from "../main"
import { searchResultToMediaInfo } from "../api/generators/search/searchResultToMediaInfo"
import { LatentSearchResult } from "../api/generators/search/types"
import { serializeClap } from "@/lib/clap/serializeClap"
import { getMockClap } from "@/lib/clap/getMockClap"
import { clapToDataUri } from "@/lib/clap/clapToDataUri"
import { getNewMediaInfo } from "../api/generators/search/getNewMediaInfo"

export default async function DreamPage({ searchParams: {
  l: latentContent,
} }: LatentQueryProps) {

  // const latentSearchResult = JSON.parse(atob(`${latentContent}`)) as LatentSearchResult

  // this will hallucinate the thumbnail on the fly - maybe we should cache it
  // const latentMedia = await searchResultToMediaInfo(latentSearchResult)

  // TODO: generate the clap from the media info
  console.log("generating a mock media info and mock clap file")
  const latentMedia = getNewMediaInfo()

  latentMedia.clapUrl = await clapToDataUri(
    getMockClap({showDisclaimer: true })
  )

  return (
    <Main latentMedia={latentMedia} />
   )
}