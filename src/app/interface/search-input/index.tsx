import { useRef, useState, useTransition } from "react"
import Link from "next/link"
// import throttle from "@jcoreio/async-throttle"
import debounce from "lodash.debounce"
import { GoSearch } from "react-icons/go"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getVideos } from "@/app/server/actions/ai-tube-hf/getVideos"

export function SearchInput() {
  const [_pending, startTransition] = useTransition()

  const setSearchAutocompleteQuery = useStore(s => s.setSearchAutocompleteQuery)
  const showAutocompleteBox = useStore(s => s.showAutocompleteBox)
  const setShowAutocompleteBox = useStore(s => s.setShowAutocompleteBox)
  
  const searchAutocompleteResults = useStore(s => s.searchAutocompleteResults)
  const setSearchAutocompleteResults = useStore(s => s.setSearchAutocompleteResults)

  const setSearchQuery = useStore(s => s.setSearchQuery)

  const [searchDraft, setSearchDraft] = useState("")

  const ref = useRef<HTMLInputElement>(null)


  // called when pressing enter or clicking on search
  const debouncedSearch = debounce((query: string) => {
    startTransition(async () => {
      console.log(`searching for "${query}"..`)

      const videos = await getVideos({
        query,
        sortBy: "match",
        maxVideos: 8,
        neverThrow: true,
        renewCache: false, // bit of optimization
      })

      console.log(`got ${videos.length} results!`)
      setSearchAutocompleteResults(videos)

      // TODO: only close the show autocomplete box if we found something
      // setShowAutocompleteBox(false)
    })
  }, 500)

  // called when pressing enter or clicking on search
  const handleSearch = () => {
    ref.current?.focus()
    setSearchQuery(searchDraft)
    setShowAutocompleteBox(true)
    debouncedSearch(searchDraft)
  }

  return (
    <div className="flex flex-row flex-grow w-[380px] lg:w-[600px]">

      <div className="flex flex-row w-full">
        <Input
          ref={ref}
          placeholder="Search"
          className={cn(
            `bg-neutral-900 text-neutral-200 dark:bg-neutral-900 dark:text-neutral-200`,
            `rounded-l-full rounded-r-none`,
            
            // we increase the line height to better catch the clicks
            `py-0 h-10 leading-7`,

            `border-neutral-700 dark:border-neutral-700 border-r-0`,
    
          )}
          onFocus={() => {
            handleSearch()
          }}
          onChange={(e) => {
            setSearchDraft(e.target.value)
            setShowAutocompleteBox(true)
            // handleSearch()
          }}
          onKeyDown={({ key }) => {
            if (key === 'Enter') {
              handleSearch()
            }
          }}
          value={searchDraft}
        />
        <Button
        className={cn(
          `rounded-l-none rounded-r-full border border-neutral-700 dark:border-neutral-700`,
          `cursor-pointer`,
          `transition-all duration-200 ease-in-out`,
          `text-neutral-200 dark:text-neutral-200 bg-neutral-800 dark:bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900`
          )}
          onClick={() => {
            handleSearch()
            // console.log("submit")
            // setShowAutocompleteBox(false)
            // setSearchDraft("")
          }}
        disabled={false}
      >
        <GoSearch className="w-6 h-6" />
      </Button>
    </div>
    <div
      className={cn(
        `absolute z-50 ml-1`,

        // please keep this in sync with the parent
        `w-[320px] lg:w-[540px]`,

        `text-neutral-200 dark:text-neutral-200 bg-neutral-900 dark:bg-neutral-900`,
        `border border-neutral-800 dark:border-neutral-800`,
        `rounded-xl shadow-2xl`,
        `flex flex-col p-2 space-y-1`,
        
        `transition-all duration-200 ease-in-out`,
        showAutocompleteBox
          ? `opacity-100 scale-100 mt-11 pointer-events-auto`
          : `opacity-0 scale-95 mt-6 pointer-events-none`
      )}
    >
      {searchAutocompleteResults.length === 0 ? <div>Nothing to show, type something and press enter</div> : null}
        {searchAutocompleteResults.map(media => (
          <Link key={media.id} href={`${process.env.NEXT_PUBLIC_DOMAIN}/watch?v=${media.id}`}>
            <div
              className={cn(
                `dark:hover:bg-neutral-800 hover:bg-neutral-800`,
                `text-sm`,
                `px-3 py-2`,
                `rounded-xl`
              )}

            >
              {media.label}
            </div>
          </Link>
        ))}
    </div>
  </div>
  )
}
