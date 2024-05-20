import { ClapSegmentStatus } from "@aitube/clap"

import { RenderedScene } from "@/types/general"

export const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: ClapSegmentStatus.TO_GENERATE,
  assetUrl: "", 
  alt: "",
  error: "",
  maskUrl: "",
  segments: []
})