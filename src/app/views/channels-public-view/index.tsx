import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getChannels } from "@/app/server/actions/api"
import { ChannelList } from "@/app/interface/channel-list"

export function ChannelsPublicView() {
  const [_isPending, startTransition] = useTransition()

  const currentChannels = useStore(s => s.currentChannels)
  const setCurrentChannels = useStore(s => s.setCurrentChannels)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      startTransition(async () => {
        try {
          const channels = await getChannels()
          setCurrentChannels(channels)
        } catch (err) {
          console.error("failed to load the public channels", err)
          setCurrentChannels([])
        } finally {
          setLoaded(true)
        }
      })
    }
  }, [isLoaded])

  return (
    <div className={cn(
      `flex flex-col`
    )}>
      <ChannelList
        channels={currentChannels}
      />
    </div>
  )
}