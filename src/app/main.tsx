"use client"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
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

  return (
    <div className={cn(
      `flex flex-row h-screen w-screen inset-0 overflow-hidden`,
      `dark`
    )}>
      <LeftMenu />
      <div className={cn(
        `flex flex-col`,
        `w-[calc(100vh-96px)]`,
        `px-2`
      )}>
        <TopMenu />
        <div className="pt-4">
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