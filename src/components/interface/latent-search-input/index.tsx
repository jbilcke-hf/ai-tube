import { useRef, useState, useTransition } from "react"
import Link from "next/link"
import { encode, decode } from 'js-base64'
// import throttle from "@jcoreio/async-throttle"
import debounce from "lodash.debounce"
import { GoSearch } from "react-icons/go"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MediaInfo } from "@/types/general"
import { search } from "@/app/api/v1/search"

export function LatentSearchInput() {
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
      console.log(`searching the latent space for "${query}"..`)

      if (query.length < 2) { console.log("search term is too short") }
      
      console.log("imaginating medias..")
      
      const imaginedMedias = await search({
        prompt: query,
        nbResults: 4
      })

      console.log(`imagined ${imaginedMedias.length} results:`, imaginedMedias)

      setSearchAutocompleteResults(imaginedMedias.map(item => ({
        title: item.title,
        tags: item.tags,
      })))
      
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
          placeholder="Search the latent space"
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
        {searchAutocompleteResults.map(item => (
          <Link key={item.id} href={
            item.id
            ? `${process.env.NEXT_PUBLIC_DOMAIN}/watch?v=${item.id}`
            : `${process.env.NEXT_PUBLIC_DOMAIN}/latent/watch?p=${encode(JSON.stringify(item))}`
            }>
            <div
              className={cn(
                `dark:hover:bg-neutral-800 hover:bg-neutral-800`,
                `text-sm`,
                `px-3 py-2`,
                `rounded-xl`
              )}

            >
              {item.title}
            </div>
          </Link>
        ))}
    </div>
  </div>
  )
}
