import { AppQueryProps } from "@/types"
import { Main } from "../main"
import { getChannel } from "../server/actions/ai-tube-hf/getChannel"
import { getChannelVideos } from "../server/actions/ai-tube-hf/getChannelVideos"

export default async function ChannelPage({ searchParams: { c: channelId } }: AppQueryProps) {
  const channel = await getChannel({ channelId, neverThrow: true })

  const publicVideos = await getChannelVideos({
    channel: channel,
    status: "published",
  })
  
  return (<Main channel={channel} publicVideos={publicVideos} />)
}