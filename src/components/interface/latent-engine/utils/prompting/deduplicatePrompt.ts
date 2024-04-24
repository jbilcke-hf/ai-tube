import { deduplicate } from "../misc/deduplicate";

export function deduplicatePrompt(input: string): string {
  return deduplicate(input.split(",").map(item => item.trim())).join(", ")
}