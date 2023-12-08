"use client"

import { useStore } from "./state/useStore"
import { HomeView } from "./views/home-view"
import { PublicChannelsView } from "./views/public-channels-view"
import { PublicChannelView } from "./views/public-channel-view"
import { UserChannelView } from "./views/user-channel-view"
import { PublicVideoView } from "./views/public-video-view"
import { UserAccountView } from "./views/user-account-view"
import { NotFoundView } from "./views/not-found-view"
import { ChannelInfo, VideoInfo } from "@/types"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TubeLayout } from "./interface/tube-layout"

// this is where we transition from the server-side space
// and the client-side space
// basically, all the views are generated in client-side space
// so the role of Main is to map server-side provided params
// to the Zustand store (client-side)
//
// one benefit of doing this is that we will able to add some animations/transitions
// more easily
export function Main({
  video,
  channel,
}: {
 // server side params
 video?: VideoInfo
 channel?: ChannelInfo
}) {
  const pathname = usePathname()
  const router = useRouter()

  const setPublicVideo = useStore(s => s.setPublicVideo)
  const setView = useStore(s => s.setView)
  const setPathname = useStore(s => s.setPathname)

  const videoId = `${video?.id || ""}`
  // console.log("Main video= "+ videoId)

  useEffect(() => {
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicVideo(video)

    if (videoId) {
      // this is a hack for hugging face:
      // we allow the ?v=<id> param on the root of the domain
      if (pathname !== "/watch") {
        // console.log("we are on huggingface apparently!")
        router.replace(`/watch?v=${videoId}`)
      }
    }
  }, [videoId])


  // this is critical: it sync the current route (coming from server-side)
  // with the zustand state manager
  useEffect(() => {
    setPathname(pathname)
  }, [pathname])


  const view = useStore(s => s.view)

  return (
    <TubeLayout>
      {view === "home" && <HomeView />}
      {view === "public_video" && <PublicVideoView />}
      {view === "public_channels" && <PublicChannelsView />}
      {view === "public_channel" && <PublicChannelView />}
      {/*view === "user_videos" && <UserVideosView />*/}
      {view === "user_channel" && <UserChannelView />}
      {view === "user_account" && <UserAccountView />}
      {view === "not_found" && <NotFoundView />}
    </TubeLayout>
  )
}