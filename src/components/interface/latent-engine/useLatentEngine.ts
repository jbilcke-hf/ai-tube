"use client"

import { create } from "zustand"

import { ClapProject } from "@/lib/clap/types"
import { newClap } from "@/lib/clap/newClap"

export type LatentEngineStore = {
  clap: ClapProject
  loaded: boolean
  load: (clap: ClapProject) => void
}

export const useLatentEngine = create<LatentEngineStore>((set, get) => ({
  clap: newClap(),
  loaded: false,

  // TODO: add a loader for either a Clap or a LatentScript

  load: (clap: ClapProject) => {
    set({
      clap,
      loaded: true
    })
  },
}))
