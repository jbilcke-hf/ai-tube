import { cn } from "@/lib/utils/cn"
import { ChannelInfo } from "@/types/general"

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
          ? `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7`
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