
import { AppQueryProps } from "@/types/general"

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
      title: `🍿 AiTube`,
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: "AiTube",
        description: "The first fully AI generated video platform",
        siteName: "🍿 AiTube",

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
      title: `${video.label} - AiTube`,
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: video.label || "", // put the video title here
        description: video.description || "", // put the vide description here
        siteName: "AiTube",
  
        videos: [
          {
            "url": video.assetUrlHd || video.assetUrl
          }
        ],
        // images: ['/some-specific-page-image.jpg', ...previousImages],
      },
    }
  } catch (err) {
    return {
      title: "AiTube",
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: "AiTube", // put the video title here
        description: "", // put the vide description here
        siteName: "AiTube",
  
        videos: [],
        images: [],
      },
    }
  }
}

// we have routes but on Hugging Face we don't see them
// so.. let's use the work around
export default async function Page({ searchParams: { v: videoId } }: AppQueryProps) {
  const publicVideo = await getVideo({
    videoId,
    neverThrow: true
  })
  return (
    <Main publicVideo={publicVideo} />
  )
}