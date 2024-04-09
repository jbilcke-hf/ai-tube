"use client"

import { useEffect, useState, useTransition } from 'react'

import { Pathway_Gothic_One } from 'next/font/google'
import { PiPopcornBold } from "react-icons/pi"
import { GoSearch } from "react-icons/go"
import { AiTubeLogo } from "./logo"

const pathway = Pathway_Gothic_One({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap"
})

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { getTags } from '@/app/server/actions/ai-tube-hf/getTags'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchInput } from '../search-input'

export function TopHeader() {
  const [_pending, startTransition] = useTransition()
  const view = useStore(s => s.view)
  const setView = useStore(s => s.setView)
  const displayMode = useStore(s => s.displayMode)
  const setDisplayMode = useStore(s => s.setDisplayMode)

  const headerMode = useStore(s => s.headerMode)
  const setHeaderMode = useStore(s => s.setHeaderMode)

  const setMenuMode = useStore(s => s.setMenuMode)

  const currentTag = useStore(s => s.currentTag)
  const setCurrentTag = useStore(s => s.setCurrentTag)

  const currentTags = useStore(s => s.currentTags)
  const setCurrentTags = useStore(s => s.setCurrentTags)

  const setSearchAutocompleteQuery = useStore(s => s.setSearchAutocompleteQuery)
  const searchAutocompleteResults = useStore(s => s.searchAutocompleteResults)

  const setSearchQuery = useStore(s => s.setSearchQuery)

  const [searchDraft, setSearchDraft] = useState("")
  useEffect(() => {
    const searchQuery = searchDraft.trim().toLowerCase()
    setSearchQuery(searchQuery)
  }, [searchDraft])

  const isNormalSize = headerMode === "normal"


  useEffect(() => {
    if (view === "public_media_embed") {
      setHeaderMode("hidden")
    } else if (view === "public_media" || view === "public_channel" || view === "public_music_videos") {
      setHeaderMode("compact")
      setMenuMode("slider_hidden")
    } else {
      setHeaderMode("normal")
      setMenuMode("normal_icon")
    }
  }, [view])

  useEffect(() => {
    startTransition(async () => {
      const tags = await getTags()
      setCurrentTags(tags)
    })
  }, [])
  
  if (headerMode === "hidden") {
    return null
  }

  return (
    <div className={cn(
      `flex flex-col`,
      `overflow-hidden`,
      `transition-all duration-200 ease-in-out`,
      `w-full`,

    )}>
      <div className={cn(
        `flex flex-row justify-between`,
        `w-full`
      )}>
        <div className={cn(
          `flex flex-col items-start justify-center`,
          `w-full sm:w-64`,
        )}>
          <Link href="/">
          <div className={cn(
            `flex flex-row items-center justify-start`,
            `transition-all duration-200 ease-in-out`,
            // `cursor-pointer`,
             "pt-2 text-3xl space-x-1",
             view === "public_music_videos" ? "pl-1" : "",
              pathway.className,
              isNormalSize
              ? "sm:scale-125 mb-2 sm:ml-4 sm:mb-4" : "sm:scale-100 sm:mb-2"
            )}
            /*
            onClick={() => {
              setView(view === "public_music_videos" ? "public_music_videos" : "home")
            }}
            */
            >
            <div className="flex items-center justify-center overflow-hidden h-10 w-6">
              <div className="scale-[5%]">
              <AiTubeLogo />
              </div>
            </div>

            <div className="font-semibold">
              {view === "public_music_videos" ? "AiTube Music" : "AiTube"}
            </div>
          </div>
          </Link>
        </div>
        <div className={cn(
          // TODO: show the disclaimer on mobile too, maybe with a modal or something
          `hidden sm:flex`,
          `flex-col`,
          `items-center justify-center`,
          `transition-all duration-200 ease-in-out`,
          `px-4 py-2 w-max-64`,
          `text-neutral-400 text-2xs sm:text-xs lg:text-sm italic`
        )}>
          <SearchInput />
        </div>
        <div className={cn("w-32 xl:w-42")}>
          <span>
            &nbsp;
            {/* reserved for future use */}
          </span>
        </div>
      </div>
      {
      isNormalSize && view !== "public_music_videos"  ? 
      <div className={cn(
        `hidden sm:flex flex-row space-x-3`,
        `text-[13px] font-semibold`,
        `mb-4`
      )}>
        {currentTags.slice(0, 9).map(tag => (
          <div
            key={tag}
            className={cn(
              `flex flex-col items-center justify-center`,
              `rounded-lg px-3 py-1 h-8`,
              `cursor-pointer`,
              `transition-all duration-200 ease-in-out`,
              currentTag === tag
                ? `bg-neutral-100 text-neutral-800`
                : `bg-neutral-800 text-neutral-50/90 hover:bg-neutral-700 hover:text-neutral-50/90`,
              // `text-clip`
            )}
            onClick={() => {
              setCurrentTag(currentTag === tag ? undefined : tag)
            }}
          >
            <span className={cn(
              `text-center`,
              `capitalize`,
            )}>{tag}</span>
          </div>
        ))}
      </div> : null}
    </div>
  )
}
