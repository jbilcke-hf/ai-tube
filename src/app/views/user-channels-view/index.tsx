"use client"

import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getChannels } from "@/app/server/actions/ai-tube-hf/getChannels"
import { ChannelList } from "@/app/interface/channel-list"
import { localStorageKeys } from "@/app/state/locaStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { Input } from "@/components/ui/input"

export function UserChannelsView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
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
    <div className={cn(`flex flex-col space-y-4`)}>
      <h2 className="text-3xl font-bold">Want your own channels? Setup your account!</h2>
        
      <div className="flex flex-col space-y-4 max-w-2xl">
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
        {huggingfaceApiKey
        ? <p className="">Nice, looks like you are ready to go!</p>
        : <p>Please setup your account (see above) to get started</p>}
      </div>

      {huggingfaceApiKey ? 
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold">Your custom channels:</h2>
        {currentChannels?.length ? <ChannelList
          channels={currentChannels}
          onSelect={(channel) => {
            setCurrentChannel(channel)
            setView("user_channel")
          }}
        /> : <p>Ask <span className="font-mono">@jbilcke-hf</span> for help to create a channel!</p>}
      </div> : null}
    </div>
  )
}