"use client"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"

export function PublicLatentMediaEmbedView() {
  const media = useStore(s => s.publicMedia)
  if (!media) { return null }
  
  // unfortunately we have to disable this,
  // as we can't afford a dream to be generated in parallel by many X users,
  // it would be way too costly
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col`
    )}>
      <a href={process.env.NEXT_PUBLIC_DOMAIN || "#"}>Please go to AiTube.at to fully enjoy this experience.</a>
    </div>
  )
}
