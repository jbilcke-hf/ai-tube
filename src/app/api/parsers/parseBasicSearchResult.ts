import { decode } from "js-base64"

import { BasicSearchResult } from "../v1/search/types"

export function parseBasicSearchResult(input?: any): BasicSearchResult {
  let basicResult = JSON.parse(decode(`${input || ""}`)) as BasicSearchResult
  return basicResult
}