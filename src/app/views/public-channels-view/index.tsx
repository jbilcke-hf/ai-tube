"use client"

import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { getChannels } from "@/app/api/actions/ai-tube-hf/getChannels"
import { ChannelList } from "@/components/interface/channel-list"

export function PublicChannelsView() {
  const [_isPending, startTransition] = useTransition()

  const publicChannels = useStore(s => s.publicChannels)
  const setPublicChannels = useStore(s => s.setPublicChannels)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      startTransition(async () => {
        try {
          const channels = await getChannels()
          setPublicChannels(channels)
        } catch (err) {
          console.error("failed to load the public channels", err)
          setPublicChannels([])
        } finally {
          setLoaded(true)
        }
      })
    }
  }, [isLoaded])

  return (
    <div className={cn(`flex flex-col`)}>
      <ChannelList
        layout="grid"
        channels={publicChannels}
      />
    </div>
  )
}