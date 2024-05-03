import { BasicSearchResult } from "../v1/search/types"

export function parseBasicSearchResult(input?: any, defaultResults: BasicSearchResult[] = []): BasicSearchResult[] {
  let basicResults: BasicSearchResult[] = defaultResults
  try {
    const rawString = decodeURIComponent(`${input || ""}` || "").trim() as string
    const maybeExistingResults = JSON.parse(rawString)
    if (Array.isArray(maybeExistingResults)) {
      basicResults = maybeExistingResults
    }
  } catch (err) {}
  return basicResults
}
