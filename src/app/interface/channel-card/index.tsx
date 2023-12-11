import { useState } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types"
import { isCertifiedUser } from "@/app/certification"
import { RiCheckboxCircleFill } from "react-icons/ri"

const DefaultAvatar = dynamic(() => import("../default-avatar"), {
  loading: () => null,
})
 
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
      if (channelThumbnail) {
        setChannelThumbnail("")
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
        {channelThumbnail ? 
          <img
            src={channelThumbnail}
            onError={handleBadChannelThumbnail}
          />
        : <DefaultAvatar
          username={channel.datasetUser}
          bgColor="#fde047"
          textColor="#1c1917"
          width={104}
          roundShape
        />}
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
        <div className="flex flex-row items-center space-x-0.5">
          <div className="flex flex-row items-center text-center text-xs font-medium">@{channel.datasetUser}</div>
          {isCertifiedUser(channel.datasetUser) ? <div className="text-xs text-neutral-400"><RiCheckboxCircleFill className="" /></div> : null}
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