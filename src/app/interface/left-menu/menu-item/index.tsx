import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function MenuItem({
  icon = null,
  children = null,
  selected = false,
  onClick = undefined,
  className = "",
}: {
  icon?: ReactNode
  children?: ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}) {

  return (
    <div className={cn(
      `flex flex-col`,
      `items-center justify-center justify-items-stretch`,
      // `bg-green-500`,
      `cursor-pointer`,
      `w-20 h-18 sm:w-full sm:h-21`, 
      `p-1`,
      `group`
    )}
      onClick={onClick ? () => {
        if (!selected) {
          onClick()
        }
      } : undefined}
    >
      <div
        className={cn(
        `flex flex-col`,
        `items-center justify-center`,
        `w-full h-full`,
        `space-y-1.5`,
        `rounded-xl`,
        `text-xs`,
        `transition-all duration-300 ease-in-out`,
        // `bg-yellow-500`,
  
        selected
          ? `bg-neutral-100/10`
          : `group-hover:bg-neutral-100/10 bg-neutral-100/0`,
     

        className,
      )}
      >
      {icon}
      <div className="text-center">
        {children}
      </div>
    </div>
  </div>
  )
}