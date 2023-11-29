
import { ParsedDatasetPrompt } from "@/types"

export function parseDatasetPrompt(markdown: string = ""): ParsedDatasetPrompt {
  try {
    const { title, description, prompt } = parseMarkdown(markdown)

    return {
      title: typeof title === "string" && title ? title : "",
      description: typeof description === "string" && description ? description : "",
      prompt: typeof prompt === "string" && prompt ? prompt : "",
    }
  } catch (err) {
    return {
      title: "",
      description:  "",
      prompt:  "",
    }
  }
}

/**
 * Simple Markdown Parser to extract sections into a JSON object
 * @param markdown A Markdown string containing Description and Prompt sections
 * @returns A JSON object with { "description": "...", "prompt": "..." }
 */
function parseMarkdown(markdown: string): ParsedDatasetPrompt {
  // Regular expression to find markdown sections based on the provided structure
  const sectionRegex = /^## (.+?)\n\n([\s\S]+?)(?=\n## |$)/gm;

  let match;
  const sections: { [key: string]: string } = {};

  // Iterate over each section match to populate the sections object
  while ((match = sectionRegex.exec(markdown))) {
    const [, key, value] = match;
    sections[key.toLowerCase()] = value.trim();
  }

  // Create the resulting JSON object with "description" and "prompt" keys
  const result = {
    title: sections['title'] || '',
    description: sections['description'] || '',
    // categories: sections['categories'] || '',
    prompt: sections['prompt'] || '',
  };

  return result;
}