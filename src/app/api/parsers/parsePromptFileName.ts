export function parsePromptFileName(filePath: string): string {
  return (filePath || "").replaceAll("prompt_", "").replaceAll(".md", "")
}