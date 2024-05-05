export function parseTrimmedString(something: any): string {
  let result: string = ""
  if (typeof something === "string") {
    result = `${something}`.trim()
  }
  return result
}