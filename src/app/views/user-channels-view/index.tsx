"use client"

import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getChannels } from "@/app/server/actions/ai-tube-hf/getChannels"
import { ChannelList } from "@/app/interface/channel-list"
import { localStorageKeys } from "@/app/state/locaStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"

export function UserChannelsView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey,] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )

  const setView = useStore(s => s.setView)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)

  const currentChannels = useStore(s => s.currentChannels)
  const setCurrentChannels = useStore(s => s.setCurrentChannels)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      startTransition(async () => {
        try {
          const channels = await getChannels({ apiKey: huggingfaceApiKey })
          setCurrentChannels(channels)
        } catch (err) {
          console.error("failed to load the channel for the current user:", err)
          setCurrentChannels([])
        } finally {
          setLoaded(true)
        }
      })
    }
  }, [isLoaded, huggingfaceApiKey])

  return (
    <div className={cn(
      `flex flex-col space-y-4`
    )}>
      {huggingfaceApiKey ? 
        <ChannelList
          channels={currentChannels}
          onSelect={(channel) => {
            setCurrentChannel(channel)
            setView("user_channel")
          }}
        /> : <p>Please setup your account to get started creating robot channels!</p>}
    </div>
  )
}