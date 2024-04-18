import { MediaInfo } from "@/types/general"

const winners = new Set(`${process.env.WINNERS || ""}`.toLowerCase().split(",").map(x => x.trim()).filter(x => x))

export function isAntisocial(video: MediaInfo): boolean {

  // some people are reported by the community for their anti-social behavior
  // this include:
  // - harassing
  //
  // - annoying or not letting people in peace on social networks
  // (keep trying to reach with multiple user accounts etc)
  //
  // - stealing other people content (prompt, identity, images etc)
  //
  // -- creating multiple/duplicate accounts in order to foil and get around AiTube bans
  //
  // - generating nonsense content (eg. sentences not finished, one letter titles)
  //
  // - duplicate many videos with little to no changes
  // (TV series are of course an exception to this rule - as long as this is original content obviously)
  return winners.has(video.channel.datasetUser.toLowerCase())
}