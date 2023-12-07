import { useState } from "react"

import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types"

const defaultChannelThumbnail = "/huggingface-avatar.jpeg"

export function ChannelCard({
  channel,
  onClick,
  className = "",
}: {
  channel: ChannelInfo
  onClick?: (channel: ChannelInfo) => void
  className?: string
 }) {
  const [channelThumbnail, setChannelThumbnail] = useState(channel.thumbnail)

  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail !== defaultChannelThumbnail) {
        setChannelThumbnail(defaultChannelThumbnail)
      }
    } catch (err) {
      
    }
  }

  return (
  <div
    className={cn(
      `flex flex-col`,
      `items-center justify-center`,
      `space-y-1`,
      `w-52 h-52`,
      `rounded-lg`,
      `hover:bg-neutral-800/30`,
      `text-neutral-100/80 hover:text-neutral-100/100`,
      `cursor-pointer`,
      className,
    )}
    onClick={() => {
      if (onClick) {
        onClick(channel)
      }
    }}
    >
      <div
        className={cn(
          `flex flex-col items-center justify-center`,
          `rounded-full overflow-hidden`,
          `w-26 h-26`
        )}
      >
        <img
          src={channelThumbnail}
          onError={handleBadChannelThumbnail}
        />
      </div>

      <div className={cn(
        `flex flex-col`,
         `items-center justify-center text-center`,
         `space-y-1`
      )}>
        <div className="text-center text-base font-medium text-zinc-100">{channel.label}</div>
        {/*<div className="text-center text-sm font-semibold">
          by <a href={
            `https://huggingface.co/${channel.datasetUser}`
          } target="_blank">@{channel.datasetUser}</a>
        </div>
        */}
        <div className="text-center text-xs font-medium">
          @{channel.datasetUser}
        </div>
        <div className="flex flex-row items-center justify-center text-neutral-400">
          <div className="text-center text-xs">{0} videos</div>
          <div className="px-1">-</div>
          <div className="text-center text-xs">{channel.likes} likes</div>
        </div>
      </div>
    </div>
  )
}