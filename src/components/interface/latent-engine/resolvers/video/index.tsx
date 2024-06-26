"use client"

import { ClapProject, ClapSegment } from "@aitube/clap"

import { LayerElement } from "../../core/types"

import { generateVideo } from "./generateVideo"
import { BasicVideo } from "./basic-video"
import { useStore } from "@/app/state/useStore"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<LayerElement> {

  const { prompt } = segment

  let src: string = ""

  try {
    src = await generateVideo({
      prompt,
      width: clap.meta.width,
      height: clap.meta.height,
      token: useStore.getState().jwtToken,
      mode: "object-uri" // it's better for videos withing Chrome, apparently
    })
    // console.log(`resolveVideo: generated ${assetUrl}`)

  } catch (err) {
    console.error(`resolveVideo failed: ${err}`)
    return {
      id: segment.id,
      element: <></>
    }
  }

  // note: the latent-video class is not used for styling, but to grab the component
  // from JS when we need to segment etc
  return {
    id: segment.id,
    element: <BasicVideo
      className="latent-video object-cover h-full"
      src={src}
      playsInline
      muted
      autoPlay
      loop
    />
  }
}