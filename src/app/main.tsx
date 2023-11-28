"use client"

import { cn } from "@/lib/utils"
import { TopMenu } from "./interface/top-menu"
import { LeftMenu } from "./interface/left-menu"
import { useStore } from "./state/useStore"
import { HomeView } from "./views/home-view"
import { ChannelsPublicView } from "./views/channels-public-view"
import { ChannelsAdminView } from "./views/channels-admin-view"
import { ChannelPublicView } from "./views/channel-public-view"
import { ChannelAdminView } from "./views/channel-admin-view"
import { VideoPublicView } from "./views/video-public-view"

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
        `w-[calc(100vh-96px)]`
      )}>
        <TopMenu />
        {view === "home" && <HomeView />}
        {view === "channels_admin" && <ChannelsAdminView />}
        {view === "channels_public" && <ChannelsPublicView />}
        {view === "channel_public" && <ChannelPublicView />}
        {view === "channel_admin" && <ChannelAdminView />}
        {view === "video_public" && <VideoPublicView />}
      </div>
    </div>
  )
}