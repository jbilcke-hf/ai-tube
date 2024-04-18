"use client"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { MediaPlayer } from "@/components/interface/media-player"

export function PublicLatentMediaView() {
  // note: 
  const media = useStore(s => s.latentMedia)
  console.log("PublicLatentMediaView", {
    "media (latentMedia)": media,
})
  if (!media) { return null }

  return (
    <div className={cn(
      `w-full`,
      `flex flex-col lg:flex-row`
    )}>
      <div className={cn(
        `flex-grow`,
        `flex flex-col`,
        `transition-all duration-200 ease-in-out`,
        `px-2 xl:px-0`
      )}>
        {/** AI MEDIA PLAYER - HORIZONTAL */}
        <MediaPlayer
          media={media}
          enableShortcuts={false}

          // that could be, but let's do it the dirty way for now
          // currentTime={desiredCurrentTime}

          className="rounded-xl overflow-hidden mb-4"
        />

        {/** AI MEDIA TITLE - HORIZONTAL */}
        <div className={cn(
          `flex flex-row space-x-2`,
          `transition-all duration-200 ease-in-out`,
          `text-lg lg:text-xl text-zinc-100 font-medium mb-0 line-clamp-2`,
          `mb-2`,
        )}>
          <div className="">{media.label}</div>
        </div>
        
        {/** MEDIA TOOLBAR - HORIZONTAL */}
        <div className={cn(
          `flex flex-col space-y-3 xl:space-y-0 xl:flex-row`,
          `transition-all duration-200 ease-in-out`,
          `items-start xl:items-center`,
          `justify-between`,
          `mb-2 lg:mb-3`,
        )}>


        </div>

        {/** MEDIA DESCRIPTION - VERTICAL */}
        <div className={cn(
          `flex flex-col p-3`,
          `transition-all duration-200 ease-in-out`,
          `rounded-xl`,
          `bg-neutral-700/50`,
          `text-sm text-zinc-100`,
        )}>

          {/* DESCRIPTION BLOCK */}
          <div className="flex flex-row space-x-2 font-medium mb-1">
            <div>no data</div>
          </div>
          <p>{media.description}</p>
        </div>
      </div>
    </div>
  )
}
