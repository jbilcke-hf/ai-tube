"use client"

import { cn } from "@/lib/utils/cn"

export function NotFoundView() {
  return (
    <div className={cn(
      `w-full`,
      `flex flex-row`,
      `items-center justify-center`
    )}>
      <h1>Sorry, we couldn&apos;t find this content.</h1>
    </div>
  )
}
