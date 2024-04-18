import { cn } from "@/lib/utils/cn"
import { ForwardedRef, forwardRef, MouseEventHandler, ReactNode } from "react"

export const ContentLayer = forwardRef(function ContentLayer({
  width = 256,
  height = 256,
  className = "",
  children,
  onClick,
}: {
  width?: number
  height?: number
  className?: string
  children?: ReactNode
  onClick?: MouseEventHandler<HTMLDivElement>
}, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div className={cn(`
      absolute
      mt-0 mb-0 ml-0 mr-0
      flex flex-col
      items-center justify-center
      pointer-events-none
      `, className)}
      style={{ width, height }}
      ref={ref}
      onClick={onClick}
      >
      <div className="h-full aspect-video">
        {children}
      </div>
    </div>
  )
})