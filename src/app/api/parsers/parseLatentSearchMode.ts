import { LatentSearchMode } from "../v1/search/route"

export function parseLatentSearchMode(input?: any, defaultMode: LatentSearchMode = "basic"): LatentSearchMode {
  let mode = defaultMode
  try {
    let maybeMode = decodeURIComponent(`${input || ""}` || defaultMode).trim()
    mode = ["basic", "extended"].includes(maybeMode) ? (maybeMode as LatentSearchMode) : defaultMode
  } catch (err) {}
  return mode
}