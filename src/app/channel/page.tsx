import { AppQueryProps } from "@/types"
import { Main } from "../main"
import { getChannel } from "../server/actions/ai-tube-hf/getChannel"

export default async function ChannelPage({ searchParams: { c: channelId } }: AppQueryProps) {
  const channel = await getChannel({ channelId, neverThrow: true })
  return (<Main channel={channel} />)
}