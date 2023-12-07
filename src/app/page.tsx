
import { AppQueryProps } from "@/types"

import { Main } from "./main"
import { getVideo } from "./server/actions/ai-tube-hf/getVideo"

// we have routes but on Hugging Face we don't see them
// so.. let's use the work around
export default async function Page({ searchParams: { v: videoId } }: AppQueryProps) {
  const video = await getVideo({ videoId, neverThrow: true })
  // console.log("Root page: videoId ----> ", video?.id)
  return (
    <Main video={video} />
  )
}