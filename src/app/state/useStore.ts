"use client"

import { create } from "zustand"

import { ChannelInfo, VideoInfo, InterfaceDisplayMode, InterfaceView, InterfaceMenuMode, InterfaceHeaderMode } from "@/types"

export const useStore = create<{
  displayMode: InterfaceDisplayMode
  setDisplayMode: (displayMode: InterfaceDisplayMode) => void

  headerMode: InterfaceHeaderMode
  setHeaderMode: (headerMode: InterfaceHeaderMode) => void

  menuMode: InterfaceMenuMode
  setMenuMode: (menuMode: InterfaceMenuMode) => void

  view: InterfaceView
  setView: (view?: InterfaceView) => void

  setPathname: (patname: string) => void

  publicChannel?: ChannelInfo
  setPublicChannel: (setPublicChannel?: ChannelInfo) => void

  publicChannels: ChannelInfo[]
  setPublicChannels: (publicChannels?: ChannelInfo[]) => void

  userChannel?: ChannelInfo
  setUserChannel: (userChannel?: ChannelInfo) => void

  userChannels: ChannelInfo[]
  setUserChannels: (userChannels?: ChannelInfo[]) => void

  currentTag?: string
  setCurrentTag: (currentTag?: string) => void

  currentTags: string[]
  setCurrentTags: (currentTags?: string[]) => void

  currentModels: string[]
  setCurrentModels: (currentModels?: string[]) => void

  currentModel?: string
  setCurrentModel: (currentModel?: string) => void

  publicVideo?: VideoInfo
  setPublicVideo: (publicVideo?: VideoInfo) => void

  publicVideos: VideoInfo[]
  setPublicVideos: (userVideos: VideoInfo[]) => void

  userVideo?: VideoInfo
  setUserVideo: (userVideo?: VideoInfo) => void

  userVideos: VideoInfo[]
  setUserVideos: (userVideos: VideoInfo[]) => void

  // currentPrompts: VideoInfo[]
  // setCurrentPrompts: (currentPrompts: VideoInfo[]) => void
}>((set, get) => ({
  displayMode: "desktop",
  setDisplayMode: (displayMode: InterfaceDisplayMode) => {
    set({ displayMode })
  },

  view: "home",
  setView: (view?: InterfaceView) => {
    // TODO: download videos for this new channel
    set({ view: view || "home" })
  },

  setPathname: (pathname: string) => {
    const routes: Record<string, InterfaceView> = {
      "/": "home",
      "/watch": "public_video",
      "/channels": "public_channels",
      "/channel": "public_channel",
      "/account": "user_account",
      "/account/channel": "user_channel",
    }

    set({ view: routes[pathname] || "not_found" })
  },

  headerMode: "normal",
  setHeaderMode: (headerMode: InterfaceHeaderMode) => {
    set({ headerMode })
  },

  menuMode: "normal_icon",
  setMenuMode: (menuMode: InterfaceMenuMode) => {
    set({ menuMode })
  },

  publicChannel: undefined,
  setPublicChannel: (publicChannel?: ChannelInfo) => {
    // TODO: download videos for this new channel
    set({ publicChannel })
  },

  publicChannels: [],
  setPublicChannels: (publicChannels: ChannelInfo[] = []) => {
    // TODO: download videos for this new channel
    set({ publicChannels: Array.isArray(publicChannels) ? publicChannels : [] })
  },

  userChannel: undefined,
  setUserChannel: (userChannel?: ChannelInfo) => {
    // TODO: download videos for this new channel
    set({ userChannel })
  },

  userChannels: [],
  setUserChannels: (userChannels: ChannelInfo[] = []) => {
    // TODO: download videos for this new channel
    set({ userChannels: Array.isArray(userChannels) ? userChannels : [] })
  },

  currentTag: undefined,
  setCurrentTag: (currentTag?: string) => {
    set({ currentTag })
  },

  currentTags: [],
  setCurrentTags: (currentTags?: string[]) => {
    set({ currentTags })
  },

  currentModels: [],
  setCurrentModels: (currentModels?: string[]) => {
    set({ currentModels })
  },

  currentModel: undefined,
  setCurrentModel: (currentModel?: string) => {
    set({ currentModel })
  },

  publicVideo: undefined,
  setPublicVideo: (publicVideo?: VideoInfo) => {
    set({ publicVideo })
  },

  publicVideos: [],
  setPublicVideos: (publicVideos: VideoInfo[] = []) => {
    set({
      publicVideos: Array.isArray(publicVideos) ? publicVideos : [] 
    })
  },

  userVideo: undefined,
  setUserVideo: (userVideo?: VideoInfo) => { set({ userVideo }) },

  userVideos: [],
  setUserVideos: (userVideos: VideoInfo[] = []) => {
    set({
      userVideos: Array.isArray(userVideos) ? userVideos : [] 
    })
  },
}))