"use client"

import { useState } from "react"
import Link from "next/link"
import { RiCheckboxCircleFill } from "react-icons/ri"

import { cn } from "@/lib/utils/cn"
import { CollectionInfo } from "@/types/general"
import { formatDuration } from "@/lib/formatters/formatDuration"
import { formatTimeAgo } from "@/lib/formatters/formatTimeAgo"
import { isCertifiedUser } from "@/app/certification"
import { transparentImage } from "@/lib/utils/transparentImage"
import { DefaultAvatar } from "../default-avatar"
import { formatLargeNumber } from "@/lib/formatters/formatLargeNumber"

export function CollectionCard({
  collection,
  className = "",
  layout = "normal",
  onSelect,
  index
}: {
  collection: CollectionInfo
  className?: string
  layout?: "normal" | "compact"
  onSelect?: (collection: CollectionInfo) => void
  index: number
 }) {
  const [duration, setDuration] = useState(0)

  const [channelThumbnail, setChannelThumbnail] = useState(collection.channel.thumbnail)
  const [collectionThumbnail, setCollectionThumbnail] = useState(
    `https://huggingface.co/datasets/jbilcke-hf/ai-tube-index/resolve/main/collections/${collection.id}.webp`
  )
  const [collectionThumbnailReady, setCollectionThumbnailReady] = useState(false)

  const isCompact = layout === "compact"

  const handleClick = () => {
    onSelect?.(collection)
  }

  const handleBadChannelThumbnail = () => {
    try {
      if (channelThumbnail) {
        setChannelThumbnail("")
      }
    } catch (err) {
      
    }
  }


  return (
  <Link href={`/collection?v=${collection.id}`}>
    <div
      className={cn(
        `w-full flex`,
        isCompact ? `flex-row h-24 py-1 space-x-2` : `flex-col space-y-3`,
        `bg-line-900`,
        `cursor-pointer`,
        className,
      )}
      >
        {/* VIDEO BLOCK */}
        <div
          className={cn(
            `flex flex-col items-center justify-center`,
            `rounded-xl overflow-hidden`,
            isCompact ? `w-42 h-[94px]` : `aspect-video`
          )}
        >
          <div className={cn(
            `relative w-full`,
            isCompact ? `w-42 h-[94px]` : `aspect-video`
          )}>
            <img
              src={collectionThumbnail}
              className={cn(
                `absolute`,
                `aspect-video`,
                `rounded-lg overflow-hidden`,
                collectionThumbnailReady ? `opacity-100`: 'opacity-0',
                `hover:opacity-0 w-full h-full top-0 z-30`,
                //`pointer-events-none`,
                `transition-all duration-500 hover:delay-300 ease-in-out`,
              )}
              onLoad={() => {
                setCollectionThumbnailReady(true)
              }}
              onError={() => {
                setCollectionThumbnail(transparentImage)
                setCollectionThumbnailReady(false)
              }}
            />
          </div>

          <div className={cn(
            // `aspect-video`,
            `z-40`,
            `w-full flex flex-row items-end justify-end`
            )}>
              <div className={cn(
                `-mt-8`,
                `mr-0`,
              )}
              >
                <div className={cn(
                  `mb-[5px]`,
                  `mr-[5px]`,
                  `flex flex-col items-center justify-center text-center`,
                  `bg-neutral-900 rounded`,
                  `text-2xs font-semibold px-[3px] py-[1px]`,
                  isFinite(duration) && !isNaN(duration) && duration > 0 ? 'opacity-100' : 'opacity-0'
                )}
                >{formatDuration(duration)}</div>
              </div>
          </div>
        </div>

        {/* TEXT BLOCK */}
        <div className={cn(
          `flex flex-row`,
          isCompact ? `w-40 lg:w-44 xl:w-51` : `space-x-4`,
        )}>
          {
          isCompact ? null
          : channelThumbnail ? <div className="flex flex-col">
            <div className="flex w-9 rounded-full overflow-hidden">
              <img
                src={channelThumbnail}
                onError={handleBadChannelThumbnail}
              />
            </div>
          </div>
          : <DefaultAvatar
              name={collection.channel.datasetUser}
              color="#fde047"
              fgColor="#1c1917"
              size="36"
              round
            />}
          <div className={cn(
            `flex flex-col`,
            isCompact ?  `` : `flex-grow`
          )}>
            <h3 className={cn(
              `text-zinc-100 font-medium mb-0 line-clamp-2`,
              isCompact ? `text-2xs md:text-xs lg:text-sm mb-1.5` : `text-base`
            )}>{collection.label}</h3>
            <div className={cn(
              `flex flex-row items-center`,
              `text-neutral-400 font-normal space-x-1`,
              isCompact ? `text-3xs md:text-2xs lg:text-xs` : `text-sm`
              )}>
              <div>{collection.channel.label}</div>
              {isCertifiedUser(collection.channel.datasetUser) ? <div><RiCheckboxCircleFill className="" /></div> : null}
            </div>
            
            <div className={cn(
              `flex flex-row`,
              `text-neutral-400 font-normal`,
              isCompact ? `text-2xs lg:text-xs` : `text-sm`,
              `space-x-1`
            )}>
            <div>{formatLargeNumber(collection.numberOfViews)} views</div>
            <div className="font-semibold scale-125">·</div>
            <div>{formatTimeAgo(collection.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}