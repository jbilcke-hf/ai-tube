import { cn } from "@/lib/utils"
import { ChannelInfo } from "@/types"

import { ChannelCard } from "../channel-card"

export function ChannelList({
  channels,
  onSelect,
  layout = "flex",
  className = "",
}: {
  channels: ChannelInfo[]

  onSelect?: (channel: ChannelInfo) => void

  /**
   * Layout mode
   * 
   * This isn't necessarily based on screen size, it can also be:
   * - based on the device type (eg. a smart TV)
   * - a design choice for a particular page
   */
  layout?: "grid" | "flex"

  className?: string
}) {
  
  return (
    <div
      className={cn(
        layout === "grid"
          ? `grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
          : `flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4`,
        className,
      )}
    >
    {channels.map((channel) => (
      <ChannelCard
        key={channel.id}
        channel={channel}
        onClick={onSelect}
        className=""
      />
    ))}
    </div>
  )
}