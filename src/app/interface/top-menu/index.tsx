import { videoCategoriesWithLabels } from "@/app/state/categories"
import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"

export function TopMenu() {
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)
  const currentChannel = useStore(s => s.currentChannel)
  const setCurrentChannel = useStore(s => s.setCurrentChannel)
  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)
  const currentVideos = useStore(s => s.currentVideos)
  const currentVideo = useStore(s => s.currentVideo)
  const setCurrentVideo = useStore(s => s.setCurrentVideo)

  return (
    <div className={cn(
      `flex flex-col`,
      `overflow-hidden`,
      `w-full h-28 pt-4`,
    )}>
      <div className={cn(
        `flex flex-row justify-between`,
        `w-full`
      )}>
        <div className={cn(
          `flex flex-col items-start justify-center`,
          `py-2 w-64`,
        )}>
          <div className="flex flex-row items-center justify-start">
            <span className="text-4xl mr-1">🍿 </span>
            <span className="text-4xl font-semibold">AI Tube</span>
          </div>
        </div>
        <div className={cn(
           `flex flex-col items-center justify-center`,
           `px-4 py-2 w-max-64`,
        )}>
          [ Search bar goes here ]
        </div>
        <div className={cn()}>
          &nbsp; {/* unused for now */}
        </div>
      </div>
      <div className={cn(
        `flex flex-row space-x-3`,
        `text-[13px] font-semibold`,
      )}>
        {Object.entries(videoCategoriesWithLabels)
          .map(([ key, label ]) => (
          <div
            key={key}
            className={cn(
              `flex flex-col items-center justify-center`,
              `rounded-lg px-3 py-1 h-8`,
              `cursor-pointer`,
              `transition-all duration-300 ease-in-out`,
              currentTag === key
                ? `bg-neutral-100 text-neutral-800`
                : `bg-neutral-800 text-neutral-50/90 hover:bg-neutral-700 hover:text-neutral-50/90`,
              // `text-clip`
            )}
            onClick={() => {
              setCurrentTag(key)
            }}
          >
            <span className={cn(
              `text-center`
            )}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}