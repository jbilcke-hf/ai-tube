"use client"

import { create } from "zustand"

import { ChannelInfo, MediaInfo, InterfaceDisplayMode, InterfaceView, InterfaceMenuMode, InterfaceHeaderMode, CommentInfo, UserInfo } from "@/types/general"

export const useStore = create<{
  displayMode: InterfaceDisplayMode
  setDisplayMode: (displayMode: InterfaceDisplayMode) => void

  headerMode: InterfaceHeaderMode
  setHeaderMode: (headerMode: InterfaceHeaderMode) => void

  menuMode: InterfaceMenuMode
  setMenuMode: (menuMode: InterfaceMenuMode) => void

  view: InterfaceView
  setView: (view?: InterfaceView) => void

  setPathname: (pathname: string) => void

  searchQuery: string
  setSearchQuery: (searchQuery?: string) => void

  showAutocompleteBox: boolean
  setShowAutocompleteBox: (showAutocompleteBox: boolean) => void

  searchAutocompleteQuery: string
  setSearchAutocompleteQuery: (searchAutocompleteQuery?: string) => void

  searchAutocompleteResults: MediaInfo[]
  setSearchAutocompleteResults: (searchAutocompleteResults: MediaInfo[]) => void

  searchResults: MediaInfo[]
  setSearchResults: (searchResults: MediaInfo[]) => void

  currentUser?: UserInfo
  setCurrentUser: (currentUser?: UserInfo) => void

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

  publicVideo?: MediaInfo
  setPublicVideo: (publicVideo?: MediaInfo) => void

  publicComments: CommentInfo[]
  setPublicComments: (publicComment: CommentInfo[]) => void

  publicVideos: MediaInfo[]
  setPublicVideos: (publicVideos: MediaInfo[]) => void

  publicChannelVideos: MediaInfo[]
  setPublicChannelVideos: (publicChannelVideos: MediaInfo[]) => void

  publicTrack?: MediaInfo
  setPublicTrack: (publicTrack?: MediaInfo) => void

  publicTracks: MediaInfo[]
  setPublicTracks: (publicTracks: MediaInfo[]) => void

  userVideo?: MediaInfo
  setUserVideo: (userVideo?: MediaInfo) => void

  userVideos: MediaInfo[]
  setUserVideos: (userVideos: MediaInfo[]) => void

  recommendedVideos: MediaInfo[]
  setRecommendedVideos: (recommendedVideos: MediaInfo[]) => void

  // currentPrompts: MediaInfo[]
  // setCurrentPrompts: (currentPrompts: MediaInfo[]) => void
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
      "/watch": "public_media",
      "/embed": "public_media_embed",
      "/music": "public_music_videos",
      "/channels": "public_channels",
      "/channel": "public_channel",
      "/account": "user_account",
      "/account/channel": "user_channel",
    }

    set({ view: routes[pathname] || "not_found" })
  },

  searchAutocompleteQuery: "",
  setSearchAutocompleteQuery: (searchAutocompleteQuery?: string) => {
    set({ searchAutocompleteQuery })
  },

  showAutocompleteBox: false,
  setShowAutocompleteBox: (showAutocompleteBox: boolean) => {
    set({ showAutocompleteBox })
  },

  searchAutocompleteResults: [] as MediaInfo[],
  setSearchAutocompleteResults: (searchAutocompleteResults: MediaInfo[]) => {
    set({ searchAutocompleteResults })
  },

  searchQuery: "",
  setSearchQuery: (searchQuery?: string) => {
    set({ searchQuery })
  },

  searchResults: [] as MediaInfo[],
  setSearchResults: (searchResults: MediaInfo[]) => {
    set({ searchResults })
  },

  currentUser: undefined,
  setCurrentUser: (currentUser?: UserInfo) => {
    set({ currentUser })
  },
  
  headerMode: "normal" as InterfaceHeaderMode,
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
  setPublicVideo: (publicVideo?: MediaInfo) => {
    set({ publicVideo })
  },

  publicComments: [],
  setPublicComments: (publicComments: CommentInfo[]) => {
    set({ publicComments })
  },

  publicVideos: [],
  setPublicVideos: (publicVideos: MediaInfo[] = []) => {
    set({
      publicVideos: Array.isArray(publicVideos) ? publicVideos : [] 
    })
  },


  publicTrack: undefined,
  setPublicTrack: (publicTrack?: MediaInfo) => {
    set({ publicTrack })
  },

  publicTracks: [],
  setPublicTracks: (publicTracks: MediaInfo[] = []) => {
    set({
      publicTracks: Array.isArray(publicTracks) ? publicTracks : [] 
    })
  },

  publicChannelVideos: [],
  setPublicChannelVideos: (publicChannelVideos: MediaInfo[] = []) => {
    set({
      publicVideos: Array.isArray(publicChannelVideos) ? publicChannelVideos : [] 
    })
  },

  userVideo: undefined,
  setUserVideo: (userVideo?: MediaInfo) => { set({ userVideo }) },

  userVideos: [],
  setUserVideos: (userVideos: MediaInfo[] = []) => {
    set({
      userVideos: Array.isArray(userVideos) ? userVideos : [] 
    })
  },

  recommendedVideos: [],
  setRecommendedVideos: (recommendedVideos: MediaInfo[]) => {
    set({
      recommendedVideos: Array.isArray(recommendedVideos) ? recommendedVideos : [] 
    })
  },
}))