
import { AppQueryProps } from "@/types"
import { Main } from "../main"
import { getVideos } from "../server/actions/ai-tube-hf/getVideos"
import { getVideo } from "../server/actions/ai-tube-hf/getVideo"
import { Metadata } from "next"


// https://nextjs.org/docs/pages/building-your-application/optimizing/fonts 
export async function generateMetadata(
  { params, searchParams: { m: mediaId } }: AppQueryProps,
  // parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params

  const metadataBase = new URL('https://huggingface.co/spaces/jbilcke-hf/ai-tube')

  try {
    const publicTrack = await getVideo({ videoId: mediaId, neverThrow: true })

    if (!publicTrack) {
      throw new Error("Video not found")
    }


    const openGraph = {
      //  'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' 
      // | 'profile' | 'website' | 'video.tv_show' | 'video.other' | 'video.movie' | 'video.episode';
      type: "music.song",

      duration: publicTrack.duration,

      // albums?: null | string | URL | OGAlbum | Array<string | URL | OGAlbum>;
      musicians: [publicTrack.channel.label, "AI (MusicGen)"],

      // url: "https://example.com",
      title: `${publicTrack.channel.label} - ${publicTrack.label}` || "", // put the video title here
      description: publicTrack.description || "", // put the vide description here
      siteName: "AiTube Music",
      images: [
        `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/videos/${publicTrack.id}.webp`
      ],
      audio: [
        {
          "url": publicTrack.assetUrl
        }
      ]
    }

    return {
      title: `${publicTrack.label} - AiTube Music`,
      metadataBase,
      openGraph,
    }
  } catch (err) {
    return {
      title: "AiTube Music",
      metadataBase,
      openGraph: {
        type: "website",
        // url: "https://example.com",
        title: "AiTube Music", // put the video title here
        description: "", // put the vide description here
        siteName: "AiTube Music",
  
        videos: [],
        images: [],
      },
    }
  }
}

export default async function MusicPage({ searchParams: { m: mediaId } }: AppQueryProps) {
  const publicTracks = await getVideos({
    sortBy: "date",
    mandatoryTags: ["music"],
    maxVideos: 25,
    neverThrow: true,
  })

  // at some point we will probably migrate to a getMedia({ mediaId }) instead
  const publicTrack = await getVideo({
    videoId: mediaId,
    neverThrow: true
  })
  
  return (<Main publicTracks={publicTracks} publicTrack={publicTrack} />)
}