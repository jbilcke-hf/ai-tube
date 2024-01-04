"use client"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { useStore } from "@/app/state/useStore"

import { LeftMenu } from "../left-menu"
import { MobileBottomMenu } from "../mobile-bottom-menu"
import { TopHeader } from "../top-header"


export function TubeLayout({ children }: { children?: ReactNode }) {
  const headerMode = useStore(s => s.headerMode)
  const view = useStore(s => s.view)
  if (headerMode === "hidden") {
    return (
      <div className={cn(
        `dark flex flex-row h-screen w-screen inset-0 overflow-hidden`
      )}>
        {children}
      </div>
    ) 
  }
  return (
    <div className={cn(
      `dark flex flex-row h-screen w-screen inset-0 overflow-hidden`,
       view === "public_video"
       ? `bg-gradient-radial from-neutral-900 to-neutral-950`
       : ''// bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-950`
     
    )}>
      <LeftMenu />
      <div className={cn(
        `flex flex-col`,
        `w-full sm:w-[calc(100vw-96px)]`,
        `pl-2`
      )}>
        <TopHeader />
        <main className={cn(
          `w-full overflow-x-hidden overflow-y-scroll`,
          `h-[calc(100%-116px)]`,
          headerMode === "normal"
            ? `sm:h-[calc(100vh-112px)]`
            : `sm:h-[calc(100vh-48px)]`
          )}>
          {children}
        </main>
        <MobileBottomMenu />
      </div>
    </div>
  )
}
