import { useEffect, useTransition } from 'react'

import { Pathway_Gothic_One } from 'next/font/google'
import { PiPopcornBold } from "react-icons/pi"

const pathway = Pathway_Gothic_One({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap"
})

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { getTags } from '@/app/server/actions/ai-tube-hf/getTags'
import Link from 'next/link'

export function TopHeader() {
  const [_pending, startTransition] = useTransition()
  const view = useStore(s => s.view)
  const setView = useStore(s => s.setView)
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)

  const headerMode = useStore(s => s.headerMode)
  const setHeaderMode = useStore(s => s.setHeaderMode)

  const setMenuMode = useStore(s => s.setMenuMode)

  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)

  const currentTags = useStore(s => s.currentTags)
  const setCurrentTags = useStore(s => s.setCurrentTags)

  const isNormalSize = headerMode === "normal"


  useEffect(() => {
    if (view === "public_video" ||  view === "public_channel") {
      setHeaderMode("compact")
      setMenuMode("slider_hidden")
    } else {
      setHeaderMode("normal")
      setMenuMode("normal_icon")
    }
  }, [view])

  useEffect(() => {
    startTransition(async () => {
      const tags = await getTags()
      setCurrentTags(tags)
    })
  }, [])
  
  return (
    <div className={cn(
      `flex flex-col`,
      `overflow-hidden`,
      `transition-all duration-200 ease-in-out`,
      `w-full`,

    )}>
      <div className={cn(
        `flex flex-row justify-between`,
        `w-full`
      )}>
        <div className={cn(
          `flex flex-col items-start justify-center`,
          `w-full sm:w-64`,
        )}>
          <div className={cn(
            `flex flex-row items-center justify-start`,
            `transition-all duration-200 ease-in-out`,
            // `cursor-pointer`,
             "pt-2 text-3xl space-x-1",
             view === "public_music_videos" ? "pl-1" : "",
              pathway.className,
              isNormalSize
              ? "sm:scale-125 sm:ml-4 sm:mb-4" : "sm:scale-100 sm:mb-2"
            )}
            /*
            onClick={() => {
              setView(view === "public_music_videos" ? "public_music_videos" : "home")
            }}
            */
            >
            <div className="mr-1">
              <div className={cn(
                `flex flex-col items-center justify-center`,
                `bg-yellow-300 text-neutral-950`,
                `rounded-lg w-6 h-7`
              )}>
                <PiPopcornBold className={cn(
                 `w-5 h-5`
                )} />
              </div>
            </div>
            <Link href="/">
              <div className="font-semibold">
                {view === "public_music_videos" ? "AiTube Music" : "AiTube"}
              </div>
            </Link>
          </div>
        </div>
        <div className={cn(
          // TODO: show the disclaimer on mobile too, maybe with a modal or something
          `hidden sm:flex`,
          `flex-col`,
          `items-center justify-center`,
          `transition-all duration-200 ease-in-out`,
          `px-4 py-2 w-max-64`,
          `text-neutral-400 text-2xs sm:text-xs lg:text-sm italic`
        )}>
        All the videos are generated using AI, for research purposes only. Some models might produce factually incorrect or biased outputs.
        </div>
        <div className={cn()}>
          &nbsp; {/* more buttons? unused for now */}
        </div>
      </div>
      {
      isNormalSize && view !== "public_music_videos"  ? 
      <div className={cn(
        `hidden sm:flex flex-row space-x-3`,
        `text-[13px] font-semibold`,
        `mb-4`
      )}>
        {currentTags.slice(0, 9).map(tag => (
          <div
            key={tag}
            className={cn(
              `flex flex-col items-center justify-center`,
              `rounded-lg px-3 py-1 h-8`,
              `cursor-pointer`,
              `transition-all duration-200 ease-in-out`,
              currentTag === tag
                ? `bg-neutral-100 text-neutral-800`
                : `bg-neutral-800 text-neutral-50/90 hover:bg-neutral-700 hover:text-neutral-50/90`,
              // `text-clip`
            )}
            onClick={() => {
              setCurrentTag(currentTag === tag ? undefined : tag)
            }}
          >
            <span className={cn(
              `text-center`,
              `capitalize`,
            )}>{tag}</span>
          </div>
        ))}
      </div> : null}
    </div>
  )
}
