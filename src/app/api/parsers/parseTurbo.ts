export function parseTurbo(
  input?: any,
  defaultValue: boolean = false
): boolean {
  let value = defaultValue
  
  try {
    let maybeTurbo = decodeURIComponent(`${input || value}`).trim().toLowerCase()

    
    if (maybeTurbo === "true" || maybeTurbo === "1") { return true }

    if (maybeTurbo === "false") { return false }

    return false
  } catch (err) {}

  return false
}