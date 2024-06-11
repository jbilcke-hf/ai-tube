import { ClapCompletionMode } from "@aitube/clap"

export function parseCompletionMode(
  input?: any,
  defaultMode: ClapCompletionMode = ClapCompletionMode.PARTIAL
): ClapCompletionMode {
  let mode = defaultMode
  
  try {
    let maybeMode = decodeURIComponent(`${input || ""}`).trim()

    if (!maybeMode) {
      maybeMode = defaultMode
    }

    mode = maybeMode as ClapCompletionMode
    
  } catch (err) {}

  if (!Object.values(ClapCompletionMode).includes(mode)) {
    throw new Error(`Invalid clap completion mode: "${mode}"`)
  }

  return mode
}