"use client"

import { create } from "zustand"

import { VideoCategory } from "./categories"
import { ChannelInfo, FullVideoInfo, InterfaceDisplayMode, InterfaceView } from "@/types"

export const useStore = create<{
  displayMode: InterfaceDisplayMode
  setDisplayMode: (displayMode: InterfaceDisplayMode) => void

  view: InterfaceView
  setView: (view?: InterfaceView) => void

  currentChannel?: ChannelInfo
  setCurrentChannel: (currentChannel?: ChannelInfo) => void

  currentChannels: ChannelInfo[]
  setCurrentChannels: (currentChannels?: ChannelInfo[]) => void

  currentCategory?: VideoCategory
  setCurrentCategory: (currentCategory?: VideoCategory) => void

  currentVideos: FullVideoInfo[]
  setCurrentVideos: (currentVideos: FullVideoInfo[]) => void

  currentVideo?: FullVideoInfo
  setCurrentVideo: (currentVideo?: FullVideoInfo) => void
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

  currentCategory: undefined,
  setCurrentCategory: (currentCategory?: VideoCategory) => {
    set({ currentCategory })
  },

  currentVideos: [],
  setCurrentVideos: (currentVideos: FullVideoInfo[] = []) => {
    set({
      currentVideos: Array.isArray(currentVideos) ? currentVideos : [] 
    })
  },

  currentVideo: undefined,
  setCurrentVideo: (currentVideo?: FullVideoInfo) => { set({ currentVideo }) },
}))