import { NextResponse, NextRequest } from "next/server"
import queryString from "query-string"
import { BasicSearchResult, ExtendedSearchResult } from "./types"
import { extend, search } from "."

export type LatentSearchMode =
  | "basic"
  | "extended"

// we hide/wrap the micro-service under a unified AiTube API
export async function GET(req: NextRequest, res: NextResponse) {

  const qs = queryString.parseUrl(req.url || "")
  const query = (qs || {}).query

  let mode: LatentSearchMode = "basic"
  try {
    mode = decodeURIComponent(query?.m?.toString() || "basic").trim() as LatentSearchMode
  } catch (err) {}


  if (mode === "basic") {
    let prompt = ""
    try {
      prompt = decodeURIComponent(query?.p?.toString() || "").trim() as string
    } catch (err) {}
    
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

    let basicResults: BasicSearchResult[] = []
    try {
      const rawString = decodeURIComponent(query?.e?.toString() || "").trim() as string
      const maybeExistingResults = JSON.parse(rawString)
      if (Array.isArray(maybeExistingResults)) {
        basicResults = maybeExistingResults
      }
    } catch (err) {}

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
