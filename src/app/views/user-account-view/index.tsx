"use client"

import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { ChannelList } from "@/app/interface/channel-list"

import { getPrivateChannels } from "@/app/server/actions/ai-tube-hf/getPrivateChannels"
import { useCurrentUser } from "@/app/state/useCurrentUser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function UserAccountView() {
  const [_isPending, startTransition] = useTransition()

  const { user, login, apiKey, longStandingApiKey, setLongStandingApiKey } = useCurrentUser({ isLoginRequired: true })
  const setView = useStore(s => s.setView)
  const userChannel = useStore(s => s.userChannel)
  const setUserChannel = useStore(s => s.setUserChannel)

  const userChannels = useStore(s => s.userChannels)
  const setUserChannels = useStore(s => s.setUserChannels)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
      startTransition(async () => {
        if (!isLoaded && apiKey) {
          try {
            const newUserChannels = await getPrivateChannels({
              apiKey,
              renewCache: true,
            })
            setUserChannels(newUserChannels)
          } catch (err) {
            console.error("failed to load the channel for the current user:", err)
            setUserChannels([])
          } finally {
            setLoaded(true)
          }
        }
      })
  }, [isLoaded, apiKey, userChannels.map(c => c.id).join(","), setUserChannels, setLoaded])
 
  const showSecretFeature = user?.userName.startsWith("jbilcke")

  return (
    <div className={cn(`flex flex-col space-y-4`)}>

      <div className="flex flex-row space-x-2 items-center">
        {showSecretFeature
          ? <label className="flex w-64">Save videos to my HF account</label>
          : <label className="flex w-64">Note: currently only the API login mode is working.</label>}
        <Input
          placeholder="Hugging Face token (with WRITE access)"
          type="password"
          className="font-mono"
          onChange={(x) => {
            setLongStandingApiKey(x.target.value, false)
          }}
          value={longStandingApiKey}
        />
      </div>

      {apiKey ? 
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold">@{user?.userName} channels</h2>
        {showSecretFeature
          ? <p>Don&apos;t see your channel? try to <Button onClick={() => login("/account")}>synchronize</Button> again.</p>
          : null
        }
       
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
        : isLoaded ? null : <p>Loading channels owned by @{user?.userName}..</p>}
      </div> : 
      (
        showSecretFeature
        ? <p>To create a channel, comment or like a video please <Button onClick={() => login("/account")}>Login with Hugging Face</Button>.</p>
        : null)
      }
    </div>
  )
}