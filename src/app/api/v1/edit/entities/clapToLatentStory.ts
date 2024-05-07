import { ClapProject, ClapSegmentCategory, ClapSegmentFilteringMode, filterSegments } from "@aitube/clap"

import { LatentStory } from "@/app/api/v1/types"

/**
 * Extract the latent story from a ClapProject
 * 
 * This is useful to pass a simplified representation of a story to a LLM
 * 
 * @param clap 
 * @returns 
 */
export async function clapToLatentStory(clap: ClapProject): Promise<LatentStory[]> {
  const shots = clap.segments.filter(s => s.category === "camera")

  const latentStories: LatentStory[] = []

  for (const shot of shots) {
    const image = filterSegments(
      ClapSegmentFilteringMode.START,
      shot,
      clap.segments,
      ClapSegmentCategory.STORYBOARD
    ).at(0)

    const title = filterSegments(
      ClapSegmentFilteringMode.START,
      shot,
      clap.segments,
      ClapSegmentCategory.INTERFACE
    ).at(0)

    const voice = filterSegments(
      ClapSegmentFilteringMode.START,
      shot,
      clap.segments,
      ClapSegmentCategory.DIALOGUE
    ).at(0)

    const latentStory: LatentStory = {
      title: title.prompt,
      image: image.prompt,
      voice: voice.prompt,
    }
    
    latentStories.push(latentStory)
  }

  return latentStories
}