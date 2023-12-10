"use server"

import { VideoInfo } from "@/types"

import { getIndex } from "./getIndex"

const HARD_LIMIT = 100

// this just return ALL videos on the platform
export async function getVideos({
  mandatoryTags = [],
  niceToHaveTags = [],
  sortBy = "date",
  ignoreVideoIds = [],
  maxVideos = HARD_LIMIT,
}: {
  // the videos MUST include those tags
  mandatoryTags?: string[]

  // tags that we should try to use to filter the videos,
  // but it isn't a hard limit - TODO: use some semantic search here?
  niceToHaveTags?: string[]

  sortBy?: "random" | "date"

  // ignore some ids - this is used to not show the same videos again
  // eg. videos already watched, or disliked etc
  ignoreVideoIds?: string[]

  maxVideos?: number
}): Promise<VideoInfo[]> {
  // the index is gonna grow more and more,
  // but in the future we will use some DB eg. Prisma or sqlite
  const published = await getIndex({
    status: "published",
    renewCache: true
  })


  let allPotentiallyValidVideos = Object.values(published)
  
  if (ignoreVideoIds.length) {
    allPotentiallyValidVideos = allPotentiallyValidVideos.filter(video => !ignoreVideoIds.includes(video.id))
  }

  if (sortBy === "date") {
    allPotentiallyValidVideos.sort(((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
  } else {
    allPotentiallyValidVideos.sort(() => Math.random() - 0.5)
  }

  let videosMatchingFilters: VideoInfo[] = allPotentiallyValidVideos

  // filter videos by mandatory tags, or else we return everything
  const mandatoryTagsList = mandatoryTags.map(tag => tag.toLowerCase().trim()).filter(tag => tag)
  if (mandatoryTagsList.length) {
    videosMatchingFilters = allPotentiallyValidVideos.filter(video => 
      video.tags.some(tag =>
        mandatoryTagsList.includes(tag.toLowerCase().trim())
      )
    )
  }

  // filter videos by mandatory tags, or else we return everything
  const niceToHaveTagsList = niceToHaveTags.map(tag => tag.toLowerCase().trim()).filter(tag => tag)
  if (niceToHaveTagsList.length) {
    videosMatchingFilters = videosMatchingFilters.filter(video => 
      video.tags.some(tag =>
        mandatoryTagsList.includes(tag.toLowerCase().trim())
      )
    )

    // if we don't have enough videos
    if (videosMatchingFilters.length < maxVideos) {
      // count how many we need
      const nbMissingVideos = maxVideos - videosMatchingFilters.length
      
      // then we try to fill the gap with valid videos from other topics
      const videosToUseAsFiller = allPotentiallyValidVideos
        .filter(video => !videosMatchingFilters.some(v => v.id === video.id)) // of course we don't reuse the same
        // .sort(() => Math.random() - 0.5) // randomize them
        .slice(0, nbMissingVideos) // and only pick those we need

      videosMatchingFilters = [
        ...videosMatchingFilters,
        ...videosToUseAsFiller,
      ]
    }
  }
  

  // we enforce the max limit of HARD_LIMIT (eg. 100)
  return videosMatchingFilters.slice(0, Math.min(HARD_LIMIT, maxVideos))
}