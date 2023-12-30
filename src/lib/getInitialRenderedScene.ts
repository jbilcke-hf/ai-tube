import { RenderedScene } from "@/types/general"

export const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: "pending",
  assetUrl: "", 
  alt: "",
  error: "",
  maskUrl: "",
  segments: []
})