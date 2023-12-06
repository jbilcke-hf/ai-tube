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

  currentChannel?: ChannelInfo
  setCurrentChannel: (currentChannel?: ChannelInfo) => void

  currentChannels: ChannelInfo[]
  setCurrentChannels: (currentChannels?: ChannelInfo[]) => void

  currentTag?: string
  setCurrentTag: (currentTag?: string) => void

  currentVideos: VideoInfo[]
  setCurrentVideos: (currentVideos: VideoInfo[]) => void

  currentVideo?: VideoInfo
  setCurrentVideo: (currentVideo?: VideoInfo) => void

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

  headerMode: "normal",
  setHeaderMode: (headerMode: InterfaceHeaderMode) => {
    set({ headerMode })
  },

  menuMode: "normal_icon",
  setMenuMode: (menuMode: InterfaceMenuMode) => {
    set({ menuMode })
  },

  currentChannel: undefined,
  setCurrentChannel: (currentChannel?: ChannelInfo) => {
    // TODO: download videos for this new channel
    set({ currentChannel })
  },

  currentChannels: [],
  setCurrentChannels: (currentChannels: ChannelInfo[] = []) => {
    // TODO: download videos for this new channel
    set({ currentChannels: Array.isArray(currentChannels) ? currentChannels : [] })
  },

  currentTag: undefined,
  setCurrentTag: (currentTag?: string) => {
    set({ currentTag })
  },

  currentVideos: [],
  setCurrentVideos: (currentVideos: VideoInfo[] = []) => {
    set({
      currentVideos: Array.isArray(currentVideos) ? currentVideos : [] 
    })
  },

  currentVideo: undefined,
  setCurrentVideo: (currentVideo?: VideoInfo) => { set({ currentVideo }) },
}))