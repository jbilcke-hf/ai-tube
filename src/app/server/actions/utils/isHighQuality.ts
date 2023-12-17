import { VideoInfo } from "@/types"

export function isHighQuality(video: VideoInfo) {
  const numberOfViews = Math.abs(Math.max(0, video.numberOfViews))
  const numberOfLikes = Math.abs(Math.max(0, video.numberOfLikes))
  const numberOfDislikes = Math.abs(Math.max(0, video.numberOfDislikes))
  

  // rock star videos will quickly reach high ratings
  const isVeryPopular = numberOfViews > 100000 || numberOfLikes > 100000

  if (isVeryPopular) { return true }

  const rating = numberOfLikes - numberOfDislikes

  // while the number of dislike should be enough, some content is so bad that
  // people don't even take the time to watch and dislike it
  // so we might add other roules
  const isAppreciatedByPeople = rating > 0

  return isAppreciatedByPeople
}