import { AppQueryProps } from "@/types/general"

import { Main } from "../main"
import { getChannel } from "../api/actions/ai-tube-hf/getChannel"
import { getChannelVideos } from "../api/actions/ai-tube-hf/getChannelVideos"

export default async function ChannelPage({ searchParams: { c: channelId } }: AppQueryProps) {
  const channel = await getChannel({ channelId, neverThrow: true })

  const publicChannelVideos = await getChannelVideos({
    channel: channel,
    status: "published",
    neverThrow: true,
  })
  
  return (<Main channel={channel} publicChannelVideos={publicChannelVideos} />)
}