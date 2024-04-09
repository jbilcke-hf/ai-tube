import { PiTrashBold } from "react-icons/pi"

import { TableCell, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils/cn"
import { MdLockClock } from "react-icons/md"
import { MediaInfo } from "@/types/general"
import { truncate } from "./truncate"

export function PendingVideoCard({
  video,
  onDelete,
  className = "",
}: {
  video: MediaInfo
  onDelete?: (video: MediaInfo) => void
  className?: string
 }) {

  const isBusy = video.status === "queued" || video.status === "generating"
  const hasError = video.status === "error"
  const isNotGeneratedYet = video.status === "submitted" || video.status === "queued" || video.status === "generating"
  const isGenerated = video.status === "published"

  return (
    <TableRow className={cn(
      className,
    )}>
      <TableCell className="w-[100px] text-xs">{truncate(video.id, 8)}</TableCell>
      <TableCell className="w-[120px]">{video.updatedAt || "N.A."}</TableCell>
      <TableCell className="w-[150px] truncate">{truncate(video.description, 20)}</TableCell>
      <TableCell className="w-[150px] truncate">{truncate(video.description, 45)}</TableCell> 
      <TableCell className="w-[100px]">{video.status}</TableCell>
      <TableCell>
        {
        isBusy
        ? <MdLockClock className="h-5 w-5" />
        : <div
          className="h-8 w-8 rounded-full cursor-pointer hover:bg-neutral-600 flex flex-col items-center justify-center"
          onClick={() => { onDelete?.(video) }}><PiTrashBold className="h-6 w-6" />
        </div>
       }</TableCell>
    </TableRow>
  )
}