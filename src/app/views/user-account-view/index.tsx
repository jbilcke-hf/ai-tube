"use client"

import { useEffect, useState, useTransition } from "react"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { ChannelList } from "@/app/interface/channel-list"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { Input } from "@/components/ui/input"

import { getPrivateChannels } from "@/app/server/actions/ai-tube-hf/getPrivateChannels"

export function UserAccountView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  const setView = useStore(s => s.setView)
  const setUserChannel = useStore(s => s.setUserChannel)

  const userChannels = useStore(s => s.userChannels)
  const setUserChannels = useStore(s => s.setUserChannels)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!isLoaded) {
      startTransition(async () => {
        try {
          const channels = await getPrivateChannels({
            apiKey: huggingfaceApiKey,
            renewCache: true,
          })
          setUserChannels(channels)
        } catch (err) {
          console.error("failed to load the channel for the current user:", err)
          setUserChannels([])
        } finally {
          setLoaded(true)
        }
      })
    }
  }, [isLoaded, huggingfaceApiKey, setUserChannels, setLoaded])

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
        {userChannels?.length ? <ChannelList
          layout="grid"
          channels={[
            // add a fake button to the list, at the beginning
            // { id: "" } as ChannelInfo,

            ...userChannels
          ]}
          onSelect={(userChannel) => {
            if (userChannel.id) {
              setUserChannel(userChannel)
            }
            setView("user_channel")
          }}
        />
        : isLoaded ? <p>You don&apos;t seem to have any channel yet. See @flngr on X to learn more about how to do this!</p> : <p>Loading channels..</p>}
      </div> : null}

    </div>
  )
}