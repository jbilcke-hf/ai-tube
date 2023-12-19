"use client"

import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";

import { VideoInfo } from "@/types";

// Define the new track type with an optional playNow property
interface PlaybackOptions<T> {
  url: string;
  meta: T;
  isLastTrackOfPlaylist?: boolean;
  playNow?: boolean; // New optional parameter
}

// Define the Zustand store
interface PlaylistState<T> {
  playlist: PlaybackOptions<T>[];
  audio: HTMLAudioElement | null;
  current: T | null;
  interval: NodeJS.Timer | null;
  progress: number;
  setProgress: (progress: number) => void;
  isPlaying: boolean;
  isSwitchingTracks: boolean;
  enqueue: (options: PlaybackOptions<T>) => void;
  dequeue: () => void;
  togglePause: () => void;
}

function getAudio(): HTMLAudioElement | null {
  try {
    return new Audio()
  } catch (err) {
    return null
  }
}

export const usePlaylistStore = create<PlaylistState<VideoInfo>>((set, get) => ({
  playlist: [],
  audio: getAudio(),
  current: null,
  progress: 0,
  interval: null,
  setProgress: (progress) => set((state) => ({
    progress: isNaN(progress) ? 0 : progress,
  })),
  isPlaying: false,
  isSwitchingTracks: false,
  enqueue: (options) => set((state) => ({ playlist: [...state.playlist, options] })),
  dequeue: () => set((state) => {
    const nextPlaying = state.playlist.length > 0 ? state.playlist[0] : null;
    return {
      current: nextPlaying ? nextPlaying.meta : null,
      playlist: state.playlist.slice(1),
      isSwitchingTracks: state.playlist.length > 1,
    };
  }),
  togglePause: () => {
    const { audio, isPlaying } = get()
    // console.log("togglePause: " + isPlaying)
    if (!audio) { return }
    // console.log("doing the thing")

    if (isPlaying) {
      // console.log("we are playing! so setting to false..")
      set({ isPlaying: false });
      audio.pause();
    } else {
      // console.log("we are not playing! so setting to true..")
      set({ isPlaying: true });
      try {
        audio.play()
      } catch (err) {
        console.error("Play failed:", err);
        set({ isPlaying: false });
      }
    }
  }
}));

// The refactored useAudioPlayer hook
export function usePlaylist() {
  const intervalRef = useRef<NodeJS.Timer>();

  const {
    playlist,
    current,
    progress,
    isPlaying,
    isSwitchingTracks,
    enqueue,
    dequeue,
    audio,
    interval,
    setProgress,
    togglePause,
  } = usePlaylistStore();

  const updateProgress = useCallback(() => {
    if (!audio) { return }
    // if (!isPlaying) { return }
    const currentProgress = audio.currentTime / audio.duration;
    // console.log("updateProgress: " + currentProgress)
    setProgress(currentProgress);
    if (currentProgress >= 1) {
      if (!audio.loop) {
        console.log("we reached the end!")
        dequeue();
      }
    }
  }, [audio?.currentTime, dequeue, setProgress, isPlaying]);

  const playback = useCallback(async (options?: PlaybackOptions<VideoInfo>): Promise<void> => {
    if (!audio) { return }

    if (!options) {
      clearInterval(intervalRef.current!);
      // console.log("playback called with nothing, so setting isPlaying to false")
      usePlaylistStore.setState({
        playlist: [],
        current: null,
        isPlaying: false,
        isSwitchingTracks: false
      });
      return
    }

    // console.log("playback!", options)

    if (options.playNow) {
      clearInterval(intervalRef.current!);
      usePlaylistStore.setState({
        playlist: [options as any], // Clears the previous playlist and adds the new track
        current: options.meta,
        isPlaying: true,
        isSwitchingTracks: false
      });

      try {
        audio.pause();
      } catch (err) {}

      try {
        audio.src = options.url;
        audio.load();
      } catch (err) {}

      try {
        await audio.play();
      } catch (err) {
      }
      intervalRef.current = setInterval(updateProgress, 250);
    } else {
      enqueue(options as any);
    }
  }, [enqueue, updateProgress]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
        usePlaylistStore.setState({ interval: null });
      }
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  return { current, playlist, playback, progress, isPlaying, isSwitchingTracks, togglePause };
}