"use client"

import { useStore } from "./state/useStore"
import { HomeView } from "./views/home-view"
import { PublicChannelsView } from "./views/public-channels-view"
import { PublicChannelView } from "./views/public-channel-view"
import { UserChannelView } from "./views/user-channel-view"
import { PublicVideoView } from "./views/public-video-view"
import { UserAccountView } from "./views/user-account-view"
import { NotFoundView } from "./views/not-found-view"
import { ChannelInfo, MediaInfo } from "@/types/general"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TubeLayout } from "./interface/tube-layout"
import { PublicMusicVideosView } from "./views/public-music-videos-view"
import { getCollectionKey } from "@/lib/getCollectionKey"
import { PublicVideoEmbedView } from "./views/public-video-embed-view"

// this is where we transition from the server-side space
// and the client-side space
// basically, all the views are generated in client-side space
// so the role of Main is to map server-side provided params
// to the Zustand store (client-side)
//
// one benefit of doing this is that we will able to add some animations/transitions
// more easily
export function Main({
  // view,
  publicVideo,
  publicVideos,
  publicChannelVideos,
  publicTracks,
  publicTrack,
  channel,
}: {
 // server side params
 // view?: InterfaceView
 publicVideo?: MediaInfo
 publicVideos?: MediaInfo[]
 publicChannelVideos?: MediaInfo[]
 publicTracks?: MediaInfo[]
 publicTrack?: MediaInfo
 channel?: ChannelInfo
}) {
  // this could be also a parameter of main, where we pass this manually
  const pathname = usePathname()
  const router = useRouter()

  const setPublicVideo = useStore(s => s.setPublicVideo)
  const setView = useStore(s => s.setView)
  const setPathname = useStore(s => s.setPathname)
  const setPublicChannel = useStore(s => s.setPublicChannel)
  const setPublicVideos = useStore(s => s.setPublicVideos)
  const setPublicChannelVideos = useStore(s => s.setPublicChannelVideos)
  const setPublicTracks = useStore(s => s.setPublicTracks)
  const setPublicTrack = useStore(s => s.setPublicTrack)

  useEffect(() => {
    if (!publicVideos?.length) { return }
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicVideos(publicVideos)
  }, [getCollectionKey(publicVideos)])


  useEffect(() => {
    if (!publicChannelVideos?.length) { return }
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicChannelVideos(publicChannelVideos)
  }, [getCollectionKey(publicChannelVideos)])

  useEffect(() => {
    if (!publicTracks?.length) { return }
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicTracks(publicTracks)
  }, [getCollectionKey(publicTracks)])


  useEffect(() => {
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicTrack(publicTrack)

    if (!publicTrack || !publicTrack?.id) { return }

    // this is a hack for hugging face:
    // we allow the ?v=<id> param on the root of the domain
    if (pathname !== "/music") {
      // console.log("we are on huggingface apparently!")
      router.replace(`/music?m=${publicTrack.id}`)
    }
  }, [publicTrack?.id])

  useEffect(() => {
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicVideo(publicVideo)

    if (!publicVideo || !publicVideo?.id) { return }

    if (pathname === "/embed") { return }
    // this is a hack for hugging face:
    // we allow the ?v=<id> param on the root of the domain
    if (pathname !== "/watch") {
      // console.log("we are on huggingface apparently!")
      router.replace(`/watch?v=${publicVideo.id}`)
    }
    
  }, [publicVideo?.id])


  useEffect(() => {
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicChannel(channel)

    if (!channel || !channel?.id) { return }

    // this is a hack for hugging face:
    // we allow the ?v=<id> param on the root of the domain
    if (pathname !== "/channel") {
      // console.log("we are on huggingface apparently!")
      router.replace(`/channel?v=${channel.id}`)
    }
  
  }, [channel?.id])


  // this is critical: it sync the current route (coming from server-side)
  // with the zustand state manager
  useEffect(() => {
    setPathname(pathname)
  }, [pathname])


  const view = useStore(s => s.view)
  return (
    <TubeLayout>
      {view === "home" && <HomeView />}
      {view === "public_video_embed" && <PublicVideoEmbedView />}
      {view === "public_video" && <PublicVideoView />}
      {view === "public_music_videos" && <PublicMusicVideosView />}
      {view === "public_channels" && <PublicChannelsView />}
      {view === "public_channel" && <PublicChannelView />}
      {/*view === "user_videos" && <UserVideosView />*/}
      {view === "user_channel" && <UserChannelView />}
      {view === "user_account" && <UserAccountView />}
      {view === "not_found" && <NotFoundView />}
    </TubeLayout>
  )
}