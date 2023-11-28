import { ChannelInfo, FullVideoInfo } from "@/types"

export async function getPublicChannels({
  userHuggingFaceApiToken
}: {
  userHuggingFaceApiToken: string
}): Promise<ChannelInfo[]> {
  // search on Hugging Face for 
  // TODO: we should probably cache this, and use a fixed list
  return []
}

export async function getPrivateChannels({
  userHuggingFaceApiToken
}: {
  userHuggingFaceApiToken: string
}): Promise<ChannelInfo[]> {
  return []
}

export async function getPrivateChannelVideos({
  userHuggingFaceApiToken,
  channel,
}: {
  userHuggingFaceApiToken: string
  channel: ChannelInfo
}): Promise<FullVideoInfo[]> {
  // TODO:
  // call the Hugging Face API to grab all the files in the dataset
  // we only get the first 30, that's enough for our demo
  return []
}