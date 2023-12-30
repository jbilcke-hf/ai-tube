import { useState } from "react"

import { RiCheckboxCircleFill } from "react-icons/ri"
import { IoAdd } from "react-icons/io5"

import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types/general"
import { isCertifiedUser } from "@/app/certification"
import { DefaultAvatar } from "../default-avatar"
import { formatLargeNumber } from "@/lib/formatLargeNumber"

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

  const isCreateButton = !channel.id

  return (
    // <Link href={`/channel?c=${channel.id}`}>
      <div
        className={cn(
        `flex flex-col`,
        `items-center justify-center`,
        `space-y-1`,
        `w-52 h-52`,
        `rounded-lg`,
        `text-neutral-100/80`,
        isCreateButton ? '' : `hover:bg-neutral-800/30 hover:text-neutral-100/100`,
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
          {isCreateButton
          ? <div className={cn(
            `flex flex-col justify-center items-center text-center`,
            `w-full h-full rounded-full`,
            `bg-neutral-700 hover:bg-neutral-600`,
            `border-2 border-neutral-400 hover:border-neutral-300`
            )}>
              <IoAdd className="w-8 h-8" />
            </div>
          : channelThumbnail
          ? <img
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
          <div className={cn(
            `text-center text-base font-medium text-zinc-100`,
            isCreateButton ? 'mt-2' : ''
          )}>{
            isCreateButton ? "Create a channel" : channel.label
          }</div>
          {/*<div className="text-center text-sm font-semibold">
            by <a href={
              `https://huggingface.co/${channel.datasetUser}`
            } target="_blank">@{channel.datasetUser}</a>
          </div>
          */}
          {!isCreateButton && <div className="flex flex-row items-center space-x-0.5">
            <div className="flex flex-row items-center text-center text-xs font-medium">@{channel.datasetUser}</div>
            {isCertifiedUser(channel.datasetUser) ? <div className="text-xs text-neutral-400"><RiCheckboxCircleFill className="" /></div> : null}
          </div>}
          {!isCreateButton && <div className="flex flex-row items-center justify-center text-neutral-400">
            <div className="text-center text-xs">{formatLargeNumber(0)} videos</div>
            <div className="px-1">-</div>
            <div className="text-center text-xs">{formatLargeNumber(channel.likes)} likes</div>
          </div>}
        </div>
      </div>
    // </Link>
  )
}