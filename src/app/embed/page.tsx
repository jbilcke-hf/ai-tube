
import { Metadata, ResolvingMetadata } from "next"

import { AppQueryProps } from "@/types/general"

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
      title: `${video.label} - AiTube`,
      metadataBase,
      openGraph: {
        // some cool stuff we could use here:
        // 'video.tv_show' | 'video.other' | 'video.movie' | 'video.episode';
        type: "video.other",
        // url: "https://example.com",
        title: video.label || "", // put the video title here
        description: video.description || "", // put the video description here
        siteName: "AiTube",
        images: [
          `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${video.id}.webp`
        ],
        videos: [
          {
            "url": video.assetUrlHd || video.assetUrl
          }
        ],
        // images: ['/some-specific-page-image.jpg', ...previousImages],
      },
      twitter: {
        card: "player",
        site: "@flngr",
        description: video.description || "", 
        images: `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${video.id}.webp`,
        players: {
          playerUrl: `https://jbilcke-hf-ai-tube.hf.space/embed?v=${video.id}`,
          streamUrl: `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${video.id}.mp4`,
          width: 1024,
          height: 576
        }
      }
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


export default async function Embed({ searchParams: { v: videoId } }: AppQueryProps) {
  const publicVideo = await getVideo({ videoId, neverThrow: true })
  // console.log("WatchPage: --> " + video?.id)
  return (
    <Main publicVideo={publicVideo} />
   )
}