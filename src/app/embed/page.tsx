
import { Metadata, ResolvingMetadata } from "next"

import { AppQueryProps } from "@/types/general"

import { Main } from "../main"
import { getVideo } from "../api/actions/ai-tube-hf/getVideo"


// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
export async function generateMetadata(
  { params, searchParams: { v: videoId } }: AppQueryProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const metadataBase = new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube')

  try {
    const media = await getVideo({ videoId, neverThrow: true })

    if (!media) {
      throw new Error("Media not found")
    }

    return {
      title: `${media.label} - AiTube`,
      metadataBase,
      openGraph: {
        // some cool stuff we could use here:
        // 'video.tv_show' | 'video.other' | 'video.movie' | 'video.episode';
        type: "video.other",
        // url: "https://example.com",
        title: media.label || "", // put the video title here
        description: media.description || "", // put the video description here
        siteName: "AiTube",
        images: [
          `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${media.id}.webp`
        ],
        videos: [
          {
            "url": media.assetUrlHd || media.assetUrl
          }
        ],
        // images: ['/some-specific-page-image.jpg', ...previousImages],
      },
      twitter: {
        card: "player",
        site: "@flngr",
        description: media.description || "", 
        images: `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${media.id}.webp`,
        players: {
          playerUrl: `${process.env.NEXT_PUBLIC_DOMAIN}/embed?v=${media.id}`,
          streamUrl: `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${media.id}.mp4`,
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


export default async function Embed({
  searchParams: {
    v: videoId

    // TODO add:
    // m: mediaId
  }
}: AppQueryProps) {
  const publicMedia = await getVideo({ videoId, neverThrow: true })
  // console.log("WatchPage: --> " + video?.id)
  return (
    <Main publicMedia={publicMedia} />
   )
}