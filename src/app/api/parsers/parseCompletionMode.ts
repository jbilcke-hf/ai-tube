import { ClapCompletionMode } from "../v1/edit/types"

export function parseCompletionMode(input?: any, defaultMode: ClapCompletionMode = "partial"): ClapCompletionMode {
  let mode = defaultMode
  try {
    let maybeMode = decodeURIComponent(`${input || ""}` || defaultMode).trim()
    mode = ["partial", "full"].includes(maybeMode) ? (maybeMode as ClapCompletionMode) : defaultMode
  } catch (err) {}
  return mode
}