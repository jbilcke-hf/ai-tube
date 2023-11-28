import { useEffect, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getChannels } from "@/app/server/actions/api"
import { ChannelList } from "@/app/interface/channel-list"

export function ChannelsAdminView() {
  const [_isPending, startTransition] = useTransition()

  const currentChannels = useStore(s => s.currentChannels)
  const setCurrentChannels = useStore(s => s.setCurrentChannels)
  const currentCategory = useStore(s => s.currentCategory)

  useEffect(() => {
    
    startTransition(async () => {
      console.log("querying the HF API..")
      const channels = await getChannels()

      console.log("channels:", channels)

      setCurrentChannels(channels)
    })

  }, [currentCategory])

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