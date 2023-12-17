import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export const actionButtonClassName = cn(
  `flex flex-row space-x-1.5 lg:space-x-2 pl-2 lg:pl-3 pr-3 lg:pr-4 h-8 lg:h-9`,
  `items-center justify-center text-center`,
  `rounded-2xl`,
  `cursor-pointer`,
  `text-xs lg:text-sm font-medium`,
  `bg-neutral-700/50 hover:bg-neutral-700/90 text-zinc-100`,
)

export function ActionButton({
  className,
  children,
  href,
  onClick,
}: {
  className?: string
  children?: ReactNode
  href?: string
  onClick?: () => void
}) {

  const classNames = cn(
    actionButtonClassName,
    className,
  )

  if (href) {
    return (
      <a href={href} className={classNames} target="_blank">
        {children}
      </a>
    )
  }
  return (
    <div className={classNames} onClick={() => {
      try {
        onClick?.()
    } catch (err) {}
    }}>
      {children}
    </div>
  )
}