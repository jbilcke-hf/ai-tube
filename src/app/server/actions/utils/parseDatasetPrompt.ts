
import { ParsedDatasetPrompt } from "@/types"

export function parseDatasetPrompt(markdown: string = ""): ParsedDatasetPrompt {
  try {
    const { title, description, tags, prompt, thumbnail } = parseMarkdown(markdown)

    return {
      title: typeof title === "string" && title ? title : "",
      description: typeof description === "string" && description ? description : "",
      tags: tags && typeof tags === "string" ? tags.split("-").map(x => x.trim()).filter(x => x) : [], 
      prompt: typeof prompt === "string" && prompt ? prompt : "",
      thumbnail: typeof thumbnail === "string" && thumbnail ? thumbnail : "",
    }
  } catch (err) {
    return {
      title: "",
      description:  "",
      tags: [],
      prompt:  "",
      thumbnail: "",
    }
  }
}

/**
 * Simple Markdown Parser to extract sections into a JSON object
 * @param markdown A Markdown string containing Description and Prompt sections
 * @returns A JSON object with { "description": "...", "prompt": "..." }
 */
function parseMarkdown(markdown: string): {
  title: string
  description: string
  tags: string
  prompt: string
  thumbnail: string
} {
  markdown = markdown.trim()

  // Improved regular expression to find markdown sections and accommodate multi-line content.
  const sectionRegex = /^#+\s+(?<key>.+?)\n\n?(?<content>[^#]+)/gm;

  const sections: { [key: string]: string } = {};

  let match;
  while ((match = sectionRegex.exec(markdown))) {
    const { key, content } = match.groups as { key: string; content: string };
    sections[key.trim().toLowerCase()] = content.trim();
  }

  return {
    title: sections["title"] || "",
    description: sections["description"] || "",
    tags: sections["tags"] || "",
    prompt: sections["prompt"] || "",
    thumbnail: sections["thumbnail"] || "",
  };
}