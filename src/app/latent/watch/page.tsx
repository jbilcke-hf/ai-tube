import { LatentQueryProps } from "@/types/general"
import { ExtendedSearchResult } from "@/app/api/v1/search/types"
import { extend } from "@/app/api/v1/search"
import { parseBasicSearchResult } from '@/app/api/parsers/parseBasicSearchResult'


import { Main } from "../../main"
import { getNewMediaInfo } from "../../api/generators/search/getNewMediaInfo"
import { getToken } from "../../api/v1/auth/getToken"

// https://jmswrnr.com/blog/protecting-next-js-api-routes-query-parameters

export default async function DreamPage({
  searchParams: {
    p: prompt,
  },
  ...rest
}: LatentQueryProps) {
  const jwtToken = await getToken({ user: "anonymous" })
  console.log(`[/latent/watch] prompt =`, prompt)
  const basicResult = parseBasicSearchResult(prompt)

  console.log("[/latent/watch] basicResult:", basicResult)

  // note that we should generate a longer synopsis from the autocomplete result
  //
  // however that is a slow process, maybe not great for a server-side rendering task,
  // so idk
  const extendedResults: ExtendedSearchResult[] = await extend({
    basicResults: [ basicResult ]
  })
  console.log(`[/latent/watch] extendedResults =`, extendedResults)

  const extendedResult = extendedResults.at(0)

  if (!extendedResult || !Array.isArray(extendedResult.tags)) {
    console.error(`failed to generated an extended result, aborting`)
    throw new Error(`Server error`)
  }
  // const latentSearchResult = JSON.parse(decode(`${latentContent}`)) as LatentSearchResult

  // TODO: we should hallucinate the thumbnail at this stage, and on the fly
  // this is useful to do it on the server-side so we can share the link on social media etc
  //
  // maybe we should cache the image
  // const latentMedia = await searchResultToMediaInfo(latentSearchResult)

  const latentMedia = getNewMediaInfo({
    label: extendedResult.title,
    description: extendedResult.description,
    prompt: extendedResult.description,
    tags: [...extendedResult.tags],
  })

  console.log(`[/latent/watch] generated media: `, latentMedia)
  // now, generating the .clap is another story, it will be much more intensive
  // so we will generate it later in async, in the client-side

  return (
    <Main latentMedia={latentMedia} jwtToken={jwtToken} />
  )
}