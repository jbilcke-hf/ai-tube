export function parseTurbo(
  input?: any,
  defaultValue: boolean = false
): boolean {
  let value = defaultValue
  
  try {
    let maybeTurbo = decodeURIComponent(`${input || value}`).trim()

    value = !!maybeTurbo

  } catch (err) {}

  return value
}