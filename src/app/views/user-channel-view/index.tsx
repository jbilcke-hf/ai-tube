"use client"

import { useEffect, useState, useTransition } from "react"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"

import { useLocalStorage } from "usehooks-ts"
import { localStorageKeys } from "@/app/state/locaStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { submitVideoRequest } from "@/app/server/actions/submitVideoRequest"
import { getVideoRequestsFromChannel } from "@/app/server/actions/ai-tube-hf/getVideoRequestsFromChannel"
import { PendingVideoList } from "@/app/interface/pending-video-list"

export function UserChannelView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  const [titleDraft, setTitleDraft] = useState("")
  const [descriptionDraft, setDescriptionDraft] = useState("")
  const [tagsDraft, setTagsDraft] = useState("")
  const [promptDraft, setPromptDraft] = useState("")
  
  // we do not include the tags in the list of required fields
  const missingFields = !titleDraft || !descriptionDraft || !promptDraft

  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentChannel = useStore(s => s.currentChannel)
  const currentVideos = useStore(s => s.currentVideos)
  const setCurrentVideos = useStore(s => s.setCurrentVideos)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  console.log("CURRENT VIDEOS:", currentVideos)
  useEffect(() => {
    if (!currentChannel) {
      return
    }

    startTransition(async () => {

      const videoRequests = await getVideoRequestsFromChannel({
        channel: currentChannel,
        apiKey: huggingfaceApiKey,
        renewCache: true
      })

      const videos: VideoInfo[] = Object.values(videoRequests).map(videoRequest => ({
        id: videoRequest.id,
        status: "submitted",
        label: videoRequest.label,
        description: videoRequest.description,
        prompt: videoRequest.prompt,
        thumbnailUrl: videoRequest.thumbnailUrl,
        assetUrl: "",
        numberOfViews: 0,
        numberOfLikes: 0,
        updatedAt: videoRequest.updatedAt,
        tags: videoRequest.tags,
        channel: currentChannel
      }))

      console.log("setCurrentVideos:", videos)

      setCurrentVideos(videos)
    })

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
          description: descriptionDraft,
          prompt: promptDraft,
          tags: tagsDraft.trim().split(",").map(x => x.trim()).filter(x => x),
        })

        // in case of success we update the frontend immediately
        // with our draft video
        setCurrentVideos([newVideo, ...currentVideos])
        setPromptDraft("")
        setDescriptionDraft("")
        setTagsDraft("")
        setTitleDraft("")
        // also renew the cache on Next's side
        /*
        await getChannelVideos({
          channel: currentChannel,
          apiKey: huggingfaceApiKey,
          renewCache: true,
        })
        */
      } catch (err) {
        console.error(err)
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  const handleDelete = (video: VideoInfo) => {
    // step 1: delete it from the dataset
    

    // step 2: if the video has already been generated,
    // we ask the robot to delete it from the index
    
  }

  return (
    <div className={cn(
      `flex flex-col space-y-8`
    )}>
      <div className="flex flex-col space-y-8 max-w-4xl">
        <h2 className="text-3xl font-bold">Robot channel settings:</h2>
        <p>TODO</p>

        <h2 className="text-3xl font-bold">Create a new AI video:</h2>

        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Title (required):</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Input
              placeholder="Title"
              className="font-mono"
              onChange={(x) => {
                setTitleDraft(x.target.value)
              }}
              value={titleDraft}
            />
          </div>
        </div>


        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Description (required):</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Textarea
              placeholder="Description"
              className="font-mono"
              rows={2}
              onChange={(x) => {
                setDescriptionDraft(x.target.value)
              }}
              value={descriptionDraft}
            />
            <p className="text-neutral-100/70">
              Short description (visible to humans, and used as context by the AI).
            </p>
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Prompt (required):</label>
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
              Describe your video content, in a synthetic way.
            </p>
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Tags (optional):</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Input
              placeholder="Tags"
              className="font-mono"
              onChange={(x) => {
                setTagsDraft(x.target.value)
              }}
              value={tagsDraft}
            />
            <p className="text-neutral-100/70">
            Comma-separated tags (eg. &quot;Education, Sports&quot;)
            </p>
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-center justify-between">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              isSubmitting || missingFields ? `opacity-50` : `opacity-100`
            )}
          >
            {missingFields ? 'Please fill the form' : isSubmitting ? 'Adding to the queue..' : 'Add prompt to the queue'}
          </Button>
          <p>Note: It can take a few hours for the video to be generated.</p>
        </div>

      </div>

      <h2 className="text-3xl font-bold">Current video prompts:</h2>

      <PendingVideoList
        videos={currentVideos}
        onDelete={handleDelete}
      />
    </div>
  )
}