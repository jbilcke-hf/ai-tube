import { ClapSegmentStatus } from "@aitube/clap"

import { RenderedScene } from "@/types/general"

export const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: "to_generate",
  assetUrl: "", 
  alt: "",
  error: "",
  maskUrl: "",
  segments: []
})