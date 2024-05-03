export function parsePrompt(input?: any) {
  let res = ""
  try {
    res = decodeURIComponent(`${input || ""}` || "").trim()
  } catch (err) {}

  if (!prompt.length) { throw new Error(`please provide a prompt`) }
  return res
}