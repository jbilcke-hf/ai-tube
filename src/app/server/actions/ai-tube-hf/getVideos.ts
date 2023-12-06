"use server"

import { VideoInfo } from "@/types"

import { getIndex } from "./getIndex"

const HARD_LIMIT = 100

// this just return ALL videos on the platform
export async function getVideos({
  tag = "",
  sortBy = "date",
  maxVideos = HARD_LIMIT,
}: {
  tag?: string
  sortBy?: "random" | "date",
  maxVideos?: number
}): Promise<VideoInfo[]> {
  // the index is gonna grow more and more,
  // but in the future we will use some DB eg. Prisma or sqlite
  const published = await getIndex({
    status: "published",
    renewCache: true
  })


  let videos = Object.values(published)
  
  // filter videos by tag, or else we return everything
  const requestedTag = tag.toLowerCase().trim()
  if (requestedTag) {
    videos = videos
      .filter(v =>
        v.tags.map(t => t.toLowerCase().trim()).includes(requestedTag)
      )
  }

  if (sortBy === "date") {
    videos.sort(((a, b) => a.updatedAt.localeCompare(b.updatedAt)))
  } else {
    videos.sort(() => Math.random() - 0.5)
  }

  // we enforce a max limit of HARD_LIMIT (eg. 100)
  return videos.slice(0, Math.min(HARD_LIMIT, maxVideos))
}