"use client"

import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { generateVideo } from "./generateVideo"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<JSX.Element> {

  const { prompt } = segment

  let assetUrl = ""
  try {
    // console.log(`resolveVideo: generating video for: ${prompt}`)

    assetUrl = await generateVideo(prompt)

    // console.log(`resolveVideo: generated ${assetUrl}`)

  } catch (err) {
    console.error(`resolveVideo failed (${err})`)
    return <></>
  }

  // note: the latent-video class is not used for styling, but to grab the component
  // from JS when we need to segment etc
  return (
    <video
      loop
      className="latent-video object-cover h-full"
      playsInline

      // muted needs to be enabled for iOS to properly autoplay
      muted
      autoPlay

      // we hide the controls
      // controls
      src={assetUrl}>
    </video>
  )
}