
import { Metadata, ResolvingMetadata } from "next"

import { AppQueryProps } from "@/types"

import { Main } from "../main"
import { getVideo } from "../server/actions/ai-tube-hf/getVideo"


// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
export async function generateMetadata(
  { params, searchParams: { v: videoId } }: AppQueryProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const metadataBase = new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube')

  try {
    const video = await getVideo({ videoId, neverThrow: true })

    if (!video) {
      throw new Error("Video not found")
    }

    return {
      title: `${video.label} - AI Tube`,
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: video.label || "", // put the video title here
        description: video.description || "", // put the vide description here
        siteName: "AI Tube",
        images: [
          `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${video.id}.webp`
        ],
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


export default async function WatchPage({ searchParams: { v: videoId } }: AppQueryProps) {
  const video = await getVideo({ videoId, neverThrow: true })
  // console.log("WatchPage: --> " + video?.id)
  return (
    <Main video={video} />
   )
}