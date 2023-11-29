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
      `w-[300px] h-[200px]`,
      `rounded-lg`,
      `bg-neutral-800 hover:bg-neutral-500/80`,
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
        `text-center`
      )}>
        <h3>{channel.label}</h3>
        <p>{channel.likes} likes</p>
      </div>
    </div>
  )
}