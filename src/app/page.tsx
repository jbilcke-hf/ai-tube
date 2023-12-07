
import { AppQueryProps } from "@/types"

import { Main } from "./main"
import { getVideo } from "./server/actions/ai-tube-hf/getVideo"
import { Metadata, ResolvingMetadata } from "next"


export async function generateMetadata(
  { params, searchParams: { v: videoId } }: AppQueryProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const metadataBase = new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube')

  if (!videoId) {
    return {
      title: `🍿 AI Tube`,
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: "AI Tube",
        description: "The first fully AI generated video platform",
        siteName: "🍿 AI Tube",

        videos: [],
        images: [],
      },
    }
  }

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

// we have routes but on Hugging Face we don't see them
// so.. let's use the work around
export default async function Page({ searchParams: { v: videoId } }: AppQueryProps) {
  const video = await getVideo({ videoId, neverThrow: true })
  return (
    <Main video={video} />
  )
}