import { ClapEntityPrompt } from "@aitube/client"
import { decode } from "js-base64"

export function parseClapEntityPrompts(input?: any): ClapEntityPrompt[] {
  const inputStr = `${input || ""}`.trim()

  // an empty string is a valid thing
  if (!inputStr) {
    return []
  }

  let basicResult = JSON.parse(decode(inputStr))
  if (Array.isArray(basicResult)) {
    return basicResult as ClapEntityPrompt[]
  } else {
    return []
  }
}