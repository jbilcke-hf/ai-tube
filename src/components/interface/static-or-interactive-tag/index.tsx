import { PiLightningFill } from "react-icons/pi"

import { cn } from "@/lib/utils/cn"

export function StaticOrInteractiveTag({
  isInteractive = false,
  size = "md",
  className = "",
}: {
  isInteractive?: boolean
  size?: "sm" | "md"
  className?: string
}) {
  const isStatic = !isInteractive


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
      // " text-red-500 border-red-500": isLive,
      " text-neutral-600 border-neutral-600": isStatic,
    }, className)}>
      <PiLightningFill />
      <span className="-mb-[1px]">
        {
        isInteractive ? "Interactive"
        // : isLive ? "Live"
        : "Static content"
      }
      </span>
    </div>
  )
}