import { encode, decode } from 'js-base64'
import { clapToDataUri, generateClapFromSimpleStory } from "@aitube/clap"

import { LatentQueryProps } from "@/types/general"

import { Main } from "../../main"
import { getNewMediaInfo } from "../../api/generators/search/getNewMediaInfo"
import { getToken } from "../../api/v1/auth/getToken"

// https://jmswrnr.com/blog/protecting-next-js-api-routes-query-parameters

export default async function LatentSearchPage({
  searchParams: {
    l: latentContent,
  },
  ...rest
}: LatentQueryProps) {
  const jwtToken = await getToken({ user: "anonymous" })


  // const latentSearchResult = JSON.parse(decodee(`${latentContent}`)) as LatentSearchResult

  // this will hallucinate the thumbnail on the fly - maybe we should cache it
  // const latentMedia = await searchResultToMediaInfo(latentSearchResult)

  // TODO: generate the clap from the media info
  console.log("generating a mock media info and mock clap file")
  const latentMedia = getNewMediaInfo()

  latentMedia.clapUrl = await clapToDataUri(
    generateClapFromSimpleStory({
      showIntroPoweredByEngine: false,
      showIntroDisclaimerAboutAI: false
    })
  )

  return (
    <Main latentMedia={latentMedia} jwtToken={jwtToken} />
  )
}