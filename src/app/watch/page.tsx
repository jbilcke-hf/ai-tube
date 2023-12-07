import { useEffect, useState, useTransition } from "react"
import Head from "next/head"
import Script from "next/script"
import { Metadata, ResolvingMetadata } from "next"


import { Main } from "../main"

import { getVideo } from "../server/actions/ai-tube-hf/getVideo"

type Props = {
  params: { id: string }
  searchParams: {
    v?: string | string[],
    [key: string]: string | string[] | undefined
  }
}

// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
export async function generateMetadata(
  { params, searchParams: { v: videoId } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const metadataBase = new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube')

  try {
    const video = await getVideo(videoId)

    if (!video) {
      throw new Error("Video not found")
    }

    return {
      title: `${video.label} - AI Tube`,
      metadataBase: new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube'),
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: video.label || "", // put the video title here
        description: video.description || "", // put the vide description here
        siteName: "AI Tube",
  
        videos: [
          {
            "url": video.assetUrl
          }
        ],
        // images: ['/some-specific-page-image.jpg', ...previousImages],
      },
    }
  } catch (err) {
    return {
      title: "AI Tube - 404 Video Not Found",
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: "AI Tube - 404 Not Found", // put the video title here
        description: "", // put the vide description here
        siteName: "AI Tube",
  
        videos: [],
        images: [],
      },
    }
  }
}


export default async function WatchPage({ searchParams: { v: videoId } }: Props) {
  // const [_pending, startTransition] = useTransition()
  // const setView = useStore(s => s.setView)
  // const setCurrentVideo = useStore(s => s.setCurrentVideo)
  const id = `${videoId || ""}`

  const video = await getVideo(videoId)

  // console.log("got video:", video.id)
  return (
    <Main video={video} />
   )
}