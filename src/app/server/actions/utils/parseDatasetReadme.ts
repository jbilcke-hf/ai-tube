
import metadataParser from "markdown-yaml-metadata-parser"

import { ParsedDatasetReadme, ParsedMetadataAndContent } from "@/types"

export function parseDatasetReadme(markdown: string = ""): ParsedDatasetReadme {
  try {
    const { metadata, content } = metadataParser(markdown) as ParsedMetadataAndContent

    const { description, prompt } = parseMarkdown(content)

    return {
      license: typeof metadata?.license === "string" ? metadata.license : "",
      pretty_name: typeof metadata?.pretty_name === "string" ? metadata.pretty_name : "",
      tags: Array.isArray(metadata?.tags) ? metadata.tags : [],
      description,
      prompt,
    }
  } catch (err) {
    return {
      license: "",
      pretty_name: "",
      tags: [], // Hugging Face tags
      description: "",
      prompt: "",
    }
  }
}

/**
 * Simple Markdown Parser to extract sections into a JSON object
 * @param markdown A Markdown string containing Description and Prompt sections
 * @returns A JSON object with { "description": "...", "prompt": "..." }
 */
function parseMarkdown(markdown: string): {
  description: string
  prompt: string
  // categories: string
} {
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
    description: sections['description'] || '',
    // categories: sections['categories'] || '',
    prompt: sections['prompt'] || '',
  };

  return result;
}