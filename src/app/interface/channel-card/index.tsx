import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types"

export function ChannelCard({
  channel,
  onClick,
  className = "",
}: {
  channel: ChannelInfo
  onClick?: (channel: ChannelInfo) => void
  className?: string
 }) {

  return (
  <div
    className={cn(
      `flex flex-col`,
      `items-center justify-center`,
      `w-52 h-52`,
      `rounded-lg`,
      `bg-neutral-900 hover:bg-neutral-700/80`,
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
          `rounded-lg overflow-hidden`
        )}
      >
        <img src="" />
      </div>

      <div className={cn(
        `flex flex-col`,
         `items-center justify-center text-center`,
         `space-y-2`
      )}>
        <div className="text-center text-lg">{channel.label}</div>
        {/*<div className="text-center text-sm font-semibold">
          by <a href={
            `https://huggingface.co/${channel.datasetUser}`
          } target="_blank">@{channel.datasetUser}</a>
        </div>
        */}
        <div className="text-center text-sm font-semibold">
          @{channel.datasetUser}
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="text-center text-sm">{0} videos</div>
          <div className="px-1">-</div>
          <div className="text-center text-sm">{channel.likes} likes</div>
        </div>
      </div>
    </div>
  )
}