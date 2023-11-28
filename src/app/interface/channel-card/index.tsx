import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types"

export function ChannelCard({
  channel,
  className = "",
}: {
  channel: ChannelInfo
  className?: string
 }) {

  return (
  <div
    className={cn(
      `flex flex-col`,
      `w-[300px] h-[400px]`,
      `bg-line-900`,
      className,
    )}>
      <div
        className={cn(
          `rounded-lg overflow-hidden`
        )}
      >
        <img src="" />
      </div>
      <div className={cn(

      )}>
        <h3>{channel.label}</h3>
      </div>
    </div>
  )
}