import { ClapEntityPrompt } from "@aitube/client"
import { decode } from "js-base64"

export function parseClapEntityPrompts(input?: any): ClapEntityPrompt[] {
  let basicResult = JSON.parse(decode(`${input || ""}`))
  if (Array.isArray(basicResult)) {
    return basicResult as ClapEntityPrompt[]
  } else {
    return []
  }
}