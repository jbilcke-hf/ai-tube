import { PiLightningFill } from "react-icons/pi"

import { cn } from "@/lib/utils/cn"
import { ClapStreamType } from "@/lib/clap/types"

export function StreamTag({
  streamType = "static",
  size = "md",
  className = "",
}: {
  streamType?: ClapStreamType
  size?: "sm" | "md"
  className?: string
}) {
  const isInteractive = streamType === "interactive"
  const isLive = streamType === "live"
  const isStatic = !isInteractive && !isLive
  console.log("debug:", {
    streamType,
    isInteractive,
    isLive,
    isStatic
  })

  return (
    <div className={cn(`
    flex flex-none flex-row
    items-center justify-center
    uppercase
    font-medium
    border
    `, {
      "rounded-xs text-2xs space-x-0.5 pl-0.5 pr-1 py-0.5": size === "sm",
      "rounded text-xs space-x-1 pl-1 pr-2 py-1": size === "md",
      " text-yellow-600 border-yellow-600": isInteractive,
      " text-red-500 border-red-500": isLive,
      " text-neutral-600 border-neutral-600": isStatic,
    }, className)}>
      <PiLightningFill />
      <span className="-mb-[1px]">
        {
        isInteractive ? "Interactive"
        : isLive ? "Live"
        : "Static content"
      }
      </span>
    </div>
  )
}