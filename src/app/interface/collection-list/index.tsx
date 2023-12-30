import { cn } from "@/lib/utils"
import { CollectionInfo } from "@/types/general"

import { CollectionCard } from "../collection-card"

export function CollectionList({
  collections = [],
  layout = "grid",
  className = "",
  onSelect,
}: {
  collections: CollectionInfo[]

  /**
   * Layout mode
   * 
   * This isn't necessarily based on screen size, it can also be:
   * - based on the device type (eg. a smart TV)
   * - a design choice for a particular page
   */
  layout?: "grid" | "horizontal" | "vertical"

  className?: string

  onSelect?: (collection: CollectionInfo) => void
}) {
  
  return (
    <div
      className={cn(
        layout === "grid"
          ? `grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
        : layout === "vertical"
          ? `grid grid-cols-1 gap-2`
          : `flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4`,
        className,
      )}
    >
    {collections.map((collection, i) => (
      <CollectionCard
        key={collection.id}
        collection={collection}
        className="w-full"
        layout={layout === "vertical" ? "compact" : "normal"}
        onSelect={onSelect}
        index={i}
      />
    ))}
    </div>
  )
}