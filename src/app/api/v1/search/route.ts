import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { BasicSearchResult, ExtendedSearchResult } from "./types"
import { extend, search } from "."
import { parsePrompt } from "../../parsers/parsePrompt"
import { parseLatentSearchMode } from "../../parsers/parseLatentSearchMode"
import { parseBasicSearchResult } from "../../parsers/parseBasicSearchResults"

export type LatentSearchMode =
  | "basic"
  | "extended"

// we hide/wrap the micro-service under a unified AiTube API
export async function GET(req: NextRequest, res: NextResponse) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  const mode = parseLatentSearchMode(query?.m)

  if (mode === "basic") {
    const prompt = parsePrompt(query?.p)

    const basicSearchResults: BasicSearchResult[] = await search({
      prompt,
      nbResults: 4
    })

    console.log(`[api/v1/search] found ${basicSearchResults.length} basic search results`)
    console.log(`[api/v1/search]`, basicSearchResults)

    return NextResponse.json(basicSearchResults, {
      status: 200,
      statusText: "OK",
    })
  } else if (mode === "extended") {

    const basicResults = parseBasicSearchResult(query?.e)

    const extendedSearchResults: ExtendedSearchResult[] = await extend({
      basicResults
    })

    console.log(`[api/v1/search] extended ${extendedSearchResults.length} search results`)

    console.log(`[api/v1/search]`, extendedSearchResults)

    return NextResponse.json(extendedSearchResults, {
      status: 200,
      statusText: "OK",
    })
  } else {
    /*
    return NextResponse.json([], {
      status: 200,
      statusText: "OK",
    })
    */
    throw new Error(`Please specify the mode.`)
  }
}
