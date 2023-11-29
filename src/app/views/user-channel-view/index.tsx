import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { VideoList } from "@/app/interface/video-list"
import { submitVideoRequest, getChannelVideos } from "@/app/server/actions/api"
import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "@/app/state/locaStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function UserChannelView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  const [titleDraft, setTitleDraft] = useState("")
  const [promptDraft, setPromptDraft] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentChannel = useStore(s => s.currentChannel)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  useEffect(() => {
    if (!currentChannel) {
      return
    }

    startTransition(async () => {
      const videos = await getChannelVideos({
        channel: currentChannel,
        apiKey: huggingfaceApiKey,
      })
      console.log("videos:", videos)
    })

    setCurrentVideos([])
  }, [huggingfaceApiKey, currentChannel, currentChannel?.id])

  const handleSubmit = () => {
    if (!currentChannel) {
      return
    }
    if (!titleDraft || !promptDraft) {
      console.log("missing title or prompt")
      return
    }

    setIsSubmitting(true)

    startTransition(async () => {
      try {
        const newVideo = await submitVideoRequest({
          channel: currentChannel,
          apiKey: huggingfaceApiKey,
          title: titleDraft,
          prompt: promptDraft
        })

        // in case of success we update the frontend immediately
        // with our draft video
        setCurrentVideos([newVideo, ...currentVideos])
        setPromptDraft("")
        setTitleDraft("")

        // also renew the cache on Next's side
        await getChannelVideos({
          channel: currentChannel,
          apiKey: huggingfaceApiKey,
          renewCache: true,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className={cn(
      `flex flex-col space-y-8`
    )}>
      <h2 className="text-3xl font-bold">Robot channel settings:</h2>
      <p>TODO</p>

      <h2 className="text-3xl font-bold">Schedule a new prompt:</h2>

      <div className="flex flex-row space-x-2 items-start">
        <label className="flex w-24">Title:</label>
        <div className="flex flex-col space-y-2 flex-grow">
          <Input
            placeholder="Title"
            className="font-mono"
            onChange={(x) => {
              setTitleDraft(x.target.value)
            }}
            value={titleDraft}
          />
          <p className="text-neutral-100/70">
            Title of the video, keep it short.
          </p>
        </div>
      </div>

      <div className="flex flex-row space-x-2 items-start">
        <label className="flex w-24">Prompt:</label>
        <div className="flex flex-col space-y-2 flex-grow">
          <Textarea
            placeholder="Prompt"
            className="font-mono"
            rows={6}
            onChange={(x) => {
              setPromptDraft(x.target.value)
            }}
            value={promptDraft}
          />
          <p className="text-neutral-100/70">
            Describe your video in natural language.
          </p>
        </div>
      </div>

      <div className="flex flex-row space-x-2 items-center justify-between">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={cn(
            isSubmitting ? `opacity-50` : `opacity-100`
          )}
        >
          {isSubmitting ? 'Adding to the queue..' : 'Add prompt to the queue'}
        </Button>
        <p>Note: It can take a few hours for the video to be generated.</p>
      </div>

      <h2 className="text-3xl font-bold">Current video prompts:</h2>

      <VideoList
        videos={currentVideos}
      />
    </div>
  )
}