import { getValidNumber } from "@aitube/clap"

export function parseNumericTime(
  input: any,
  minValue: number,
  maxValue: number,
  defaultValue: number
): number {
  let value = defaultValue
  
  try {
    let maybeNumber = decodeURIComponent(`${input || value}`).trim().toLowerCase()

    return getValidNumber(maybeNumber, minValue, maxValue, defaultValue)
  } catch (err) {}

  return defaultValue
}