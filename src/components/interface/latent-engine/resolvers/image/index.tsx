"use client"

import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { generateImage } from "./generateImage"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<JSX.Element> {

  const { prompt } = segment

  let assetUrl = ""
  try {
    // console.log(`resolveImage: generating video for: ${prompt}`)

    assetUrl = await generateImage(prompt)

    // console.log(`resolveImage: generated ${assetUrl}`)

  } catch (err) {
    console.error(`resolveImage failed (${err})`)
    return <></>
  }

  // note: the latent-image class is not used for styling, but to grab the component
  // from JS when we need to segment etc
  return (
    <img className="latent-image object-cover" src={assetUrl} />
  )
}