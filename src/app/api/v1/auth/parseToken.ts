export function parseToken(input?: any): string {
  try {
    return (decodeURIComponent(`${input || ""}`).split("Bearer").pop() || "").trim()
  } catch (err) {
    return ""
  }
}
