"use client"

import { ClapProject, ClapSegment } from "@/lib/clap/types"
import { PromiseResponseType, waitPromisesUntil } from "@/lib/utils/waitPromisesUntil"
import { generateVideo } from "./generateVideo"
import { BasicVideo } from "./basic-video"
import { useStore } from "@/app/state/useStore"

export async function resolve(segment: ClapSegment, clap: ClapProject): Promise<JSX.Element> {

  const { prompt } = segment


  // this is were the magic happen, and we create our buffer of N videos
  // we need to adopt a conservative approach, ideally no more than 3 videos in parallel per user
  const numberOfParallelRequests = 3

  // the playback speed is the second trick:
  // it allows us to get more "value" per video (a run time of 2 sec instead of 1)
  // at the expense of a more sluggish appearance (10 fps -> 5 fps, if you pick a speed of 0.5)
  const playbackSpeed = 0.5

  // running multiple requests in parallel increase the risk that a server is down
  // we also cannot afford to wait for all videos for too long as this increase latency,
  // so we should keep a tight execution window

   // with current resolution and step settings,
   // we achieve 3463.125 rendering time on a A10 Large
   const maxRenderingTimeForAllVideos = 5000

  // this is how long we wait after we received our first video
  // this represents the variability between rendering time
  //
  // this parameters helps us "squeeze" the timeout,
  // if the hardware settings changed for instance
  // this is a way to say "how, this is faster than I expected, other videos should be fast too then"
  //
  // I've noticed it is between 0.5s and 1s with current settings
  // so let's a a slightly larger value
  const maxWaitTimeAfterFirstVideo = 1500

  let playlist: string[] = []

  try {
    // console.log(`resolveVideo: generating video for: ${prompt}`)
    const promises: Array<Promise<string>> = []

    for (let i = 0; i < numberOfParallelRequests; i++) {
      // TODO use the Clap segments instead to bufferize the next scenes,
      // otherwise we just clone the current segment, which is not very interesting
      promises.push(generateVideo({
        prompt,
        width: clap.meta.width,
        height: clap.meta.height,
        token: useStore.getState().jwtToken,
        mode: "object-uri" // it's better for videos withing Chrome, apparently
      }))
    }

    const results = await waitPromisesUntil(promises, maxWaitTimeAfterFirstVideo, maxRenderingTimeForAllVideos)
    
    playlist = results
      .filter(result => result?.status === PromiseResponseType.Resolved && typeof result?.value === "string")
      .map(result => result?.value || "")


    // console.log(`resolveVideo: generated ${assetUrl}`)

  } catch (err) {
    console.error(`resolveVideo failed: ${err}`)
    return <></>
  }

  // note: the latent-video class is not used for styling, but to grab the component
  // from JS when we need to segment etc
  return (
    <BasicVideo
      className="latent-video object-cover h-full"
      playbackSpeed={playbackSpeed}
      src={playlist[0]}
      playsInline
      muted
      autoPlay
      loop
    />
  )
}