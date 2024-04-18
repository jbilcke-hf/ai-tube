import YAML from "yaml"

export function parseRawStringToYAML<T>(input: any, defaultValue: T) {
  try {
    let rawString = `${input || ""}`.trim()

    rawString = rawString
    .replaceAll("```yaml\n", "")
    .replaceAll("```yaml", "")

    // we remove everything after the last ```
    rawString = rawString.split('```')[0].trim()

    const something: any = YAML.parse(rawString)

    return something as T
  } catch (err) {
    return defaultValue
  }
}