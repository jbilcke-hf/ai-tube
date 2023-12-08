import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"

export function ActionButton({
  className,
  children,
  href
}: {
  className?: string
  children?: ReactNode
  href?: string
}) {

  const classNames = cn(
    `flex flex-row space-x-2 pl-3 pr-4 h-9`,
    `items-center justify-center text-center`,
    `rounded-2xl`,
    `cursor-pointer`,
    `text-sm font-medium`,
    `bg-neutral-700/50 hover:bg-neutral-700/90 text-zinc-100`,
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
    <div className={classNames}>
      {children}
    </div>
  )
}