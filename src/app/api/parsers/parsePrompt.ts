export function parsePrompt(input?: any, throwIfEmpty?: boolean) {
  let res = ""
  try {
    res = decodeURIComponent(`${input || ""}` || "").trim()
  } catch (err) {}

  if (!res.length) {
    if (throwIfEmpty) {
      throw new Error(`please provide a prompt`)
    } else {
      return ""
    }
  }
  return res
}