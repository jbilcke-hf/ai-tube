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
  const shots = clap.segments.filter(s => s.category === ClapSegmentCategory.CAMERA)

  const latentStories: LatentStory[] = []

  for (const shot of shots) {
    const image = filterSegments(
      ClapSegmentFilteringMode.START,
      shot,
      clap.segments,
      ClapSegmentCategory.IMAGE
    ).at(0)

    // note: the comment might be missing, that's on purpose
    // this can happen if the user asked for no captions or no commentary
    const comment = filterSegments(
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
      comment: comment?.prompt || "",
      image: image?.prompt || "",
      voice: voice?.prompt || "",
    }
    
    latentStories.push(latentStory)
  }

  return latentStories
}