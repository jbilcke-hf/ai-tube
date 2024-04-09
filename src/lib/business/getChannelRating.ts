import { ChannelInfo } from "@/types/general"

const winners = new Set(`${process.env.WINNERS || ""}`.toLowerCase().split(",").map(x => x.trim()).filter(x => x))

// TODO: replace by a better algorithm
export function getChannelRating(channel: ChannelInfo) {
  if (winners.has(channel.datasetUser.toLowerCase())) { return 0 }

  // TODO check views statistics to determine clusters
  
  return 5
}
