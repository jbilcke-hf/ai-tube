import { ForwardedRef, forwardRef, ReactNode } from "react"

export const ContentLayer = forwardRef(function ContentLayer({
  width = 256,
  height = 256,
  className = "",
  children,
}: {
  width?: number
  height?: number
  className?: string
  children?: ReactNode
}, ref: ForwardedRef<HTMLDivElement>) {
  return (
    <div className="
      absolute
      mt-0 mb-0 ml-0 mr-0
      flex flex-col
      items-center justify-center
      "
      style={{ width, height }}
      ref={ref}
      >
      <div className="h-full aspect-video">
        {children}
      </div>
    </div>
  )
})