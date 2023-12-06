import { Pathway_Gothic_One } from 'next/font/google'
import { PiPopcornBold } from "react-icons/pi"

const pathway = Pathway_Gothic_One({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap"
})

import { videoCategoriesWithLabels } from "@/app/state/categories"
import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { useEffect } from 'react'

export function TopHeader() {
  const view = useStore(s => s.view)
  const setView = useStore(s => s.setView)
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)

  const headerMode = useStore(s => s.headerMode)
  const setHeaderMode = useStore(s => s.setHeaderMode)

  const setMenuMode = useStore(s => s.setMenuMode)


  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)
  const currentVideos = useStore(s => s.currentVideos)
  const currentVideo = useStore(s => s.currentVideo)

  const isNormalSize = headerMode === "normal"


  useEffect(() => {
    if (view === "public_video") {
      setHeaderMode("compact")
      setMenuMode("slider_hidden")
    } else {
      setHeaderMode("normal")
      setMenuMode("normal_icon")
    }
  }, [view])
  
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
          `w-64`,
        )}>
          <div className={cn(
            `flex flex-row items-center justify-start`,
            `transition-all duration-200 ease-in-out`,
            `cursor-pointer`,
             "pt-2 text-3xl space-x-1",
              pathway.className,
              isNormalSize
              ? "scale-125 ml-4 mb-4" : "scale-100 mb-2"
            )}
            onClick={() => {
              setView("home")
            }}
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
            <div className="font-semibold">
              AiTube
            </div>
          </div>
        </div>
        <div className={cn(
           `transition-all duration-200 ease-in-out`,
           `flex flex-col items-center justify-center`,
           `px-4 py-2 w-max-64`,
           `text-neutral-400 text-sm italic`
        )}>
        Ai Tube is a platform where all videos are generated using AI, for research and experimentation purposes.
        </div>
        <div className={cn()}>
          &nbsp; {/* more buttons? unused for now */}
        </div>
      </div>
      {
      isNormalSize ? 
      <div className={cn(
        `flex flex-row space-x-3`,
        `text-[13px] font-semibold`,
        `mb-4`
      )}>
        {Object.entries(videoCategoriesWithLabels)
          .map(([ key, label ]) => (
          <div
            key={key}
            className={cn(
              `flex flex-col items-center justify-center`,
              `rounded-lg px-3 py-1 h-8`,
              `cursor-pointer`,
              `transition-all duration-200 ease-in-out`,
              currentTag === key
                ? `bg-neutral-100 text-neutral-800`
                : `bg-neutral-800 text-neutral-50/90 hover:bg-neutral-700 hover:text-neutral-50/90`,
              // `text-clip`
            )}
            onClick={() => {
              setCurrentTag(key)
            }}
          >
            <span className={cn(
              `text-center`
            )}>{label}</span>
          </div>
        ))}
      </div> : null}
    </div>
  )
}
