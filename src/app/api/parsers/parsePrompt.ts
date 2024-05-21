export function parsePrompt(input?: any) {
  let res = ""
  try {
    res = decodeURIComponent(`${input || ""}` || "").trim()
  } catch (err) {}

  if (!res.length) { throw new Error(`please provide a prompt`) }
  return res
}