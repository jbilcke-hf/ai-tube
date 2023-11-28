"use client"

import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getChannels } from "@/app/server/actions/api"
import { ChannelList } from "@/app/interface/channel-list"
import { Input } from "@/components/ui/input"
import { localStorageKeys } from "@/app/state/locaStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"

export function ChannelsAdminView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )

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
  }, [isLoaded])

  return (
    <div className={cn(
      `flex flex-col space-y-4`
    )}>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row space-x-2 items-center">
          <label className="flex w-64">Hugging Face token:</label>
          <Input
            placeholder="Hugging Face token (with WRITE access)"
            type="password"
            className="font-mono"
            onChange={(x) => {
              setHuggingfaceApiKey(x.target.value)
            }}
            value={huggingfaceApiKey}
          />
        </div>
        <p className="text-neutral-100/70">
          Note: your Hugging Face token must be a <span className="font-bold font-mono text-yellow-300">WRITE</span> access token.
        </p>
      </div>
      {huggingfaceApiKey ? 
        <ChannelList
          channels={currentChannels}
        /> : null}
    </div>
  )
}