
import { AppQueryProps } from "@/types/general"

import { Main } from "./main"
import { getVideo } from "./api/actions/ai-tube-hf/getVideo"
import { Metadata, ResolvingMetadata } from "next"
import { arvo, signika } from './fonts'
import { cn } from "@/lib/utils/cn"

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
  const publicMedia = await getVideo({
    videoId,
    neverThrow: true
  })
  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center h-screen v-screen bg-stone-800`,
        signika.className
      )}
      style={{
        background: `
          repeating-radial-gradient(#0c0a09 0 0.0001%,#393534 0 0.0002%) 50% 0/2500px 2500px,
          repeating-conic-gradient(#0c0a09 0 0.0001%,#393534 0 0.0002%) 60% 60%/2500px 2500px;
        `,
        backgroundBlendMode: 'difference',
        animation: 'staticnoise .2s infinite alternate',
        boxShadow: "inset 0 0 10vh 0 rgb(0 0 0 / 50%)" 
      }}
      >
      <div className="
      flex flex-col items-center justify-center text-center
      w-3/4 h-full
   
      ">
      <h1 className="text-yellow-400/90 text-6xl font-thin">Say goodbye to static videos.</h1>
      <p className="mt-6 text-white/80 text-xl font-thin">Beta planned for Winter 2024. Follow <a href="x.com/@flngr" className="font-normal font-mono text-stone-50/60 hover:text-stone-50/80 hover:underline hover:underline-offset-2" target="_blank">@flngr</a> for updates.</p>
      </div>
    </div>
  )
}