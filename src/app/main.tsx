"use client"

import { cn } from "@/lib/utils"
import { TopHeader } from "./interface/top-header"
import { LeftMenu } from "./interface/left-menu"
import { useStore } from "./state/useStore"
import { HomeView } from "./views/home-view"
import { PublicChannelsView } from "./views/public-channels-view"
import { UserChannelsView } from "./views/user-channels-view"
import { PublicChannelView } from "./views/public-channel-view"
import { UserChannelView } from "./views/user-channel-view"
import { PublicVideoView } from "./views/public-video-view"
import { UserAccountView } from "./views/user-account-view"

export function Main() {
  const view = useStore(s => s.view)
  const headerMode = useStore(s => s.headerMode)
  return (
    <div className={cn(
      `flex flex-row h-screen w-screen inset-0 overflow-hidden`,
      `dark`
    )}>
      <LeftMenu />
      <div className={cn(
        `flex flex-col`,
        `w-[calc(100vw-96px)]`,
        `px-2`
      )}>
        <TopHeader />
        <div className={cn(
          `w-full overflow-x-hidden overflow-y-scroll`,
          headerMode === "normal"
            ? `h-[calc(100vh-112px)]`
            : `h-[calc(100vh-48px)]`
        )}>
          {view === "home" && <HomeView />}
          {view === "public_video" && <PublicVideoView />}
          {view === "public_channels" && <PublicChannelsView />}
          {view === "public_channel" && <PublicChannelView />}
          {view === "user_channels" && <UserChannelsView />}
          {/*view === "user_videos" && <UserVideosView />*/}
          {view === "user_channel" && <UserChannelView />}
          {view === "user_account" && <UserAccountView />}

        </div>
      </div>
    </div>
  )
}