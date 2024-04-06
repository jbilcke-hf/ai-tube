import { IoIosPlay } from "react-icons/io"
import { IoIosPause } from "react-icons/io"

import { cn } from "@/lib/utils"
import { usePlaylist } from "@/lib/usePlaylist"
import { MediaInfo } from "@/types/general"

export function PlaylistControl() {
  const playlist = usePlaylist()

  return (
    <div className="flex flex-row items-center justify-center bg-neutral-900 h-20 w-full">
      {/* center buttons */}
      <div className="flex flex-row items-center justify-center space-x-4">

        {/*<div className="">{playlist.current?.label}</div>*/}

        <div className={cn(
          `flex flex-col items-center justify-center text-center`,
          `size-16`,
          `cursor-pointer`,
          `transition-all duration-200 ease-in-out`,
          `rounded-full border border-zinc-500 hover:border-zinc-400 hover:bg-zinc-800  text-zinc-400 hover:text-zinc-300`
        )}
        onClick={() => {
          playlist.togglePause()
        }}
        >
          {playlist.isPlaying
            ? <IoIosPause className="size-10" />
            : <IoIosPlay className="pl-1 size-10" />
          }
        </div>

      </div>
    </div>
  )
}