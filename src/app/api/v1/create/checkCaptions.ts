export function checkCaptions(input: string): {
  prompt: string
  hasCaptions: boolean
} {

  const prompt = input.replaceAll(/,? ?(?:no|without|skip|hide|empty|remove|delete) (?:(?:the|any|all) )?(?:comment|caption|commentary|sub|subtitle|title|subtext|commentarie)s?(?: (?:pls|plz|please|thanks?))?/gi, "")

  return {
    prompt,

    // the rule is that we have captions, unless we did have text like "no captions"
    hasCaptions: prompt === input
  }
}