export function dirtyLLMResponseCleaner(input: string): string {
  let str = (
    `${input || ""}`
    // a summary of all the weird hallucinations I saw it make..
    .replaceAll(`"\n`, `",\n`) // fix missing commas at the end of a line
    .replaceAll(`"]`, `"}]`)
    .replaceAll(/"\S*,?\S*\]/gi, `"}]`)
    .replaceAll(/"\S*,?\S*\}\S*]/gi, `"}]`)

    // this removes the trailing commas (which are valid in JS but not JSON)
    .replace(/,(?=\s*?[\}\]])/g, '')
    
    .replaceAll("}}", "}")
    .replaceAll("]]", "]")
    .replaceAll("[[", "[")
    .replaceAll("{{", "{")
    .replaceAll(",,", ",")
  )

  // repair missing end of JSON array
  if (str.at(-1) === '}') {
    str = str + "]"
  }

  if (str.at(-1) === '"') {
    str = str + "}]"
  }

  if (str[0] === '{') {
    str = "[" + str
  }
  
  if (str[0] === '"') {
    str = "[{" + str
  }

  return str
}