"use client"

import { useEffect, useState, useTransition } from "react"

import { defaultMediaOrientation, parseMediaOrientation } from "@aitube/clap"
import { useLocalStorage } from "usehooks-ts"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { VideoGenerationModel, MediaInfo } from "@/types/general"
import { localStorageKeys } from "@/app/state/localStorageKeys"
import { defaultSettings } from "@/app/state/defaultSettings"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { submitVideoRequest } from "@/app/api/actions/submitVideoRequest"
import { PendingVideoList } from "@/components/interface/pending-video-list"
import { getChannelVideos } from "@/app/api/actions/ai-tube-hf/getChannelVideos"
import { parseVideoModelName } from "@/app/api/parsers/parseVideoModelName"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { defaultVideoModel, defaultVoice } from "@/app/config"

export function UserChannelView() {
  const [_isPending, startTransition] = useTransition()
  const [huggingfaceApiKey, setHuggingfaceApiKey] = useLocalStorage<string>(
    localStorageKeys.huggingfaceApiKey,
    defaultSettings.huggingfaceApiKey
  )
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState<VideoGenerationModel>(defaultVideoModel)
  const [lora, setLora] = useState("")
  const [style, setStyle] = useState("")
  const [voice, setVoice] = useState(defaultVoice)
  const [music, setMusic] = useState("")
  const [duration, setDuration] = useState(0)
  const [orientation, setOrientation] = useState(defaultMediaOrientation)

  // we do not include the tags in the list of required fields
  const missingFields = !title || !description || !prompt

  const [isSubmitting, setIsSubmitting] = useState(false)


  const userChannel = useStore(s => s.userChannel)
  const userChannels = useStore(s => s.userChannels)
  const userVideos = useStore(s => s.userVideos)
  const setUserChannel = useStore(s => s.setUserChannel)
  const setUserChannels = useStore(s => s.setUserChannels)
  const setUserVideos = useStore(s => s.setUserVideos)


  useEffect(() => {
    if (!userChannel) {
      return
    }

    startTransition(async () => {

      const videos = await getChannelVideos({
        channel: userChannel,
        // status: undefined, // we want *all* status
      })

      console.log("setCurrentVideos:", videos)

      setUserVideos(videos)
    })

  }, [huggingfaceApiKey, userChannel, userChannel?.id])

  const handleSubmit = () => {
    if (!userChannel) {
      return
    }
    if (!title || !prompt) {
      console.log("missing title or prompt")
      return
    }

    setIsSubmitting(true)

    startTransition(async () => {
      try {
        const newVideo = await submitVideoRequest({
          channel: userChannel,
          apiKey: huggingfaceApiKey,
          title,
          description,
          prompt,
          model,
          lora,
          style,
          voice,
          music,
          tags: tags.trim().split(",").map(x => x.trim()).filter(x => x),
          duration,
          orientation
        })

        // in case of success we update the frontend immediately
        // with our  video
        setUserVideos([newVideo, ...userVideos])
        setPrompt("")
        setDescription("")
        setTags("")
        setTitle("")
        setModel(defaultVideoModel)
        setVoice(defaultVoice)
        setMusic("")
        setLora("")
        setStyle("")

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

  const handleDelete = (video: MediaInfo) => {
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
                setTitle(x.target.value)
              }}
              value={title}
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
                setDescription(x.target.value)
              }}
              value={description}
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
                setPrompt(x.target.value)
              }}
              value={prompt}
            />
            <p className="text-neutral-100/70">
              Describe your video content, in a synthetic way.
            </p>
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Video model:</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Select
              onValueChange={(value: string) => {
                setModel(parseVideoModelName(value, defaultVideoModel))
              }}
              defaultValue={defaultVideoModel}>
              <SelectTrigger className="">
                <SelectValue placeholder="Video model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SVD">SVD (default)</SelectItem>
                <SelectItem value="HotshotXL">HotshotXL</SelectItem>
                <SelectItem value="LaVie">LaVie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/*

        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Video duration:</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Input
              placeholder="Duration"
              className="font-mono"
              onChange={(x) => {
                // TODO: clamp the value here + on server side
                setDuration(parseInt(x.target.value))
              }}
              value={title}
            />
          </div>
        </div>
        */}
        
        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Video orientation:</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Select
              onValueChange={(value: string) => {
                setOrientation(parseMediaOrientation(value, defaultMediaOrientation))
              }}
              defaultValue={defaultMediaOrientation}>
              <SelectTrigger className="">
                <SelectValue placeholder="Video orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Landscape">Landscape (default)</SelectItem>
                <SelectItem value="Portrait">Portrait</SelectItem>
                {/* <SelectItem value="LaVie">Square</SelectItem> */}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-row space-x-2 items-start">
          <label className="flex w-24 pt-1">Tags (optional):</label>
          <div className="flex flex-col space-y-2 flex-grow">
            <Input
              placeholder="Tags"
              className="font-mono"
              onChange={(x) => {
                setTags(x.target.value)
              }}
              value={tags}
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
        videos={userVideos}
        onDelete={handleDelete}
      />
    </div>
  )
}