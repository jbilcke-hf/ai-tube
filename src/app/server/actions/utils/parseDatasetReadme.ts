
import metadataParser from "markdown-yaml-metadata-parser"

import { ParsedDatasetReadme, ParsedMetadataAndContent } from "@/types/general"
import { parseVideoModelName } from "./parseVideoModelName"
import { parseVideoOrientation } from "./parseVideoOrientation"
import { defaultVideoModel, defaultVideoOrientation } from "@/app/config"

export function parseDatasetReadme(markdown: string = ""): ParsedDatasetReadme {
  try {
    markdown = markdown.trim()

    const { metadata, content } = metadataParser(markdown) as ParsedMetadataAndContent

    // console.log("DEBUG README:", { metadata, content })
    
    const { model, lora, style, thumbnail, voice, music, description, prompt, tags, orientation } = parseMarkdown(content)

    return {
      license: typeof metadata?.license === "string" ? metadata.license : "",
      pretty_name: typeof metadata?.pretty_name === "string" ? metadata.pretty_name : "",
      hf_tags: Array.isArray(metadata?.tags) ? metadata.tags : [],
      tags: tags && typeof tags === "string" ? tags.split("-").map(x => x.trim()).filter(x => x) : [], 
      model: parseVideoModelName(model, defaultVideoModel),
      lora,
      style: style && typeof style === "string" ? style.split("- ").map(x => x.trim()).filter(x => x).join(", ") : [].join(", "),
      thumbnail,
      voice,
      music,
      description,
      prompt,
      orientation: parseVideoOrientation(orientation, defaultVideoOrientation),
    }
  } catch (err) {
    return {
      license: "",
      pretty_name: "",
      hf_tags: [], // Hugging Face tags
      tags: [],
      model: defaultVideoModel,
      lora: "",
      style: "",
      thumbnail: "",
      voice: "",
      music: "",
      description: "",
      prompt: "",
      orientation: defaultVideoOrientation,
    }
  }
}

/**
 * Simple Markdown Parser to extract sections into a JSON object
 * @param markdown A Markdown string containing Description and Prompt sections
 * @returns A JSON object with { "description": "...", "prompt": "..." }
 */
function parseMarkdown(markdown: string): {
  model: string
  lora: string
  style: string
  thumbnail: string
  voice: string
  music: string
  description: string
  prompt: string
  tags: string
  orientation: string
} {
  // console.log("markdown:", markdown)
  // Improved regular expression to find markdown sections and accommodate multi-line content.
  const sectionRegex = /^#+\s+(?<key>.+?)\n\n?(?<content>[^#]+)/gm;

  const sections: { [key: string]: string } = {};

  let match;
  while ((match = sectionRegex.exec(markdown))) {
    const { key, content } = match.groups as { key: string; content: string };
    sections[key.trim().toLowerCase()] = content.trim();
  }

  return {
    description: sections["description"] || "",
    model: sections["model"] || "",
    lora: sections["lora"] || "",
    style: sections["style"] || "",
    thumbnail: sections["thumbnail"] || "",
    voice: sections["voice"] || "",
    music: sections["music"] || "",
    prompt: sections["prompt"] || "",
    tags: sections["tags"] || "",
    orientation:  sections["orientation"] || "",
  };
}