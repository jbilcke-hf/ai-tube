
import { v4 as uuidv4 } from "uuid"

import { ClapMeta, ClapModel, ClapProject, ClapScene, ClapSegment, ClapStreamType } from "./types"
import { getValidNumber } from "@/lib/utils/getValidNumber"

// generate an empty clap file, or copy one from a source
export function newClap(clap: {
    meta?: Partial<ClapMeta>
    models?: ClapModel[]
    scenes?: ClapScene[]
    segments?: ClapSegment[]
  } = {}): ClapProject {

  const meta: ClapMeta = {
    id: clap?.meta?.id === "string" ? clap.meta.id : uuidv4(),
    title: clap?.meta?.title === "string" ? clap.meta.title : "",
    description: typeof clap?.meta?.description === "string" ? clap.meta.description : "",
    synopsis: typeof clap?.meta?.synopsis === "string" ? clap.meta.synopsis : "",
    licence: typeof clap?.meta?.licence === "string" ? clap.meta.licence : "",
    orientation: clap?.meta?.orientation === "portrait" ? "portrait" : clap?.meta?.orientation === "square" ? "square" : "landscape",
    width: getValidNumber(clap?.meta?.width, 256, 8192, 1024),
    height: getValidNumber(clap?.meta?.height, 256, 8192, 576),
    defaultVideoModel: typeof clap?.meta?.defaultVideoModel === "string" ? clap?.meta.defaultVideoModel : "SVD",
    extraPositivePrompt: Array.isArray(clap?.meta?.extraPositivePrompt) ? clap?.meta.extraPositivePrompt : [],
    screenplay: typeof clap?.meta?.screenplay === "string" ? clap?.meta.screenplay : "",
    streamType: (typeof clap?.meta?.streamType == "string" ? clap?.meta?.streamType : "static") as ClapStreamType,
  }

  const models: ClapModel[] = clap?.models && Array.isArray(clap.models) ? clap.models : []
  const scenes: ClapScene[] =  clap?.scenes && Array.isArray(clap.scenes) ? clap.scenes : []
  const segments: ClapSegment[] =  clap?.segments && Array.isArray(clap.segments) ? clap.segments : []

  return { meta, models, scenes, segments }
}
