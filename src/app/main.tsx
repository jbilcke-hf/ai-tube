"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { ChannelInfo, MediaInfo } from "@/types/general"
import { getCollectionKey } from "@/lib/business/getCollectionKey"

import { useStore } from "./state/useStore"
import { HomeView } from "./views/home-view"
import { PublicChannelsView } from "./views/public-channels-view"
import { PublicChannelView } from "./views/public-channel-view"
import { UserChannelView } from "./views/user-channel-view"
import { UserAccountView } from "./views/user-account-view"
import { NotFoundView } from "./views/not-found-view"
import { TubeLayout } from "../components/interface/tube-layout"
import { PublicMusicVideosView } from "./views/public-music-videos-view"
import { PublicMediaEmbedView } from "./views/public-media-embed-view"
import { PublicMediaView } from "./views/public-media-view"
import { PublicLatentMediaEmbedView } from "./views/public-latent-media-embed-view"
import { PublicLatentMediaView } from "./views/public-latent-media-view"

// this is where we transition from the server-side space
// and the client-side space
// basically, all the views are generated in client-side space
// so the role of Main is to map server-side provided params
// to the Zustand store (client-side)
//
// one benefit of doing this is that we will able to add some animations/transitions
// more easily
export function Main({
  jwtToken,

  // view,
  publicMedia,
  publicMedias,

  latentMedia,
  latentMedias,

  publicChannelVideos,

  publicTracks,
  publicTrack,
  channel,
}: {
  // token used to secure communications between the Next frontend and the Next API
  // this doesn't necessarily mean the user has to be logged it:
  // we can use this for anonymous visitors too.
  jwtToken?: string
 
  // server side params
  // view?: InterfaceView
  publicMedia?: MediaInfo
  publicMedias?: MediaInfo[]
 
  latentMedia?: MediaInfo
  latentMedias?: MediaInfo[]
 
  publicChannelVideos?: MediaInfo[]
 
  publicTracks?: MediaInfo[]
  publicTrack?: MediaInfo
 
  channel?: ChannelInfo
}) {
  // this could be also a parameter of main, where we pass this manually
  const pathname = usePathname()
  const router = useRouter()

  const setJwtToken = useStore(s => s.setJwtToken)
  const setPublicMedia = useStore(s => s.setPublicMedia)
  const setView = useStore(s => s.setView)
  const setPathname = useStore(s => s.setPathname)
  const setPublicChannel = useStore(s => s.setPublicChannel)
  const setPublicMedias = useStore(s => s.setPublicMedias)
  const setPublicLatentMedia = useStore(s => s.setPublicLatentMedia)
  const setPublicLatentMedias = useStore(s => s.setPublicLatentMedias)
  const setPublicChannelVideos = useStore(s => s.setPublicChannelVideos)
  const setPublicTracks = useStore(s => s.setPublicTracks)
  const setPublicTrack = useStore(s => s.setPublicTrack)

  useEffect(() => {
    if (typeof jwtToken !== "string" && !jwtToken) { return }
    setJwtToken(jwtToken)
  }, [jwtToken])


  useEffect(() => {
    if (!publicMedias?.length) { return }
    // note: it is important to ALWAYS set the current video to videoId
    // even if it's undefined
    setPublicMedias(publicMedias)
  }, [getCollectionKey(publicMedias)])


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
    setPublicMedia(publicMedia)

    if (!publicMedia || !publicMedia?.id) { return }

    if (pathname === "/embed") { return }
    // this is a hack for hugging face:
    // we allow the ?v=<id> param on the root of the domain
    if (pathname !== "/watch") {
      // console.log("we are on huggingface apparently!")
      router.replace(`/watch?v=${publicMedia.id}`)
    }
    
  }, [publicMedia?.id])

  useEffect(() => {
    if (!latentMedias?.length) { return }
    setPublicLatentMedias(latentMedias)
  }, [getCollectionKey(latentMedias)])

  useEffect(() => {
    console.log("latentMedia:", {
      "id": latentMedia?.id
    })
    console.log(latentMedia)
    setPublicLatentMedia(latentMedia)
    if (!latentMedia || !latentMedia?.id) { return }
    if (pathname === "/dream/embed") { return }
    if (pathname !== "/dream") {
      // console.log("we are on huggingface apparently!")
      // router.replace(`/watch?v=${publicMedia.id}`)

      // TODO: add params in the URL to represent the latent result
      router.replace(`/dream`)
    }
  }, [latentMedia?.id])


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
      {view === "public_media_embed" && <PublicMediaEmbedView />}
      {view === "public_media" && <PublicMediaView />}

      {/* latent content is the content that "doesn't exist" (is generated by the AI) */}
      {view === "public_latent_media_embed" && <PublicLatentMediaEmbedView />}
      {view === "public_latent_media" && <PublicLatentMediaView />}

      {view === "public_music_videos" && <PublicMusicVideosView />}
      {view === "public_channels" && <PublicChannelsView />}
      {view === "public_channel" && <PublicChannelView />}
      {/*view === "user_medias" && <UserMediasView />*/}
      {view === "user_channel" && <UserChannelView />}
      {view === "user_account" && <UserAccountView />}
      {view === "not_found" && <NotFoundView />}
    </TubeLayout>
  )
}