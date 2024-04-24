"use client"

import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { generateImage } from "./generateImage"
import { LayerElement } from "../../core/types"
import { useStore } from "@/app/state/useStore"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<LayerElement> {

  const { prompt } = segment

  let assetUrl = ""
  try {
    // console.log(`resolveImage: generating video for: ${prompt}`)

    assetUrl = await generateImage({
      prompt,
      width: clap.meta.width,
      height: clap.meta.height,
      token: useStore.getState().jwtToken,
    })

    // console.log(`resolveImage: generated ${assetUrl}`)

  } catch (err) {
    console.error(`resolveImage failed (${err})`)
    return {
      id: segment.id,
      element: <></>
    }
  }

  // note: the latent-image class is not used for styling, but to grab the component
  // from JS when we need to segment etc
  return {
    id: segment.id,
    element: <img
      className="latent-image object-cover h-full"
      src={assetUrl}
    />
  }
}