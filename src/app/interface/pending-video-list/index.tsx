import { cn } from "@/lib/utils"
import { VideoInfo } from "@/types"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { PendingVideoCard } from "../pending-video-card"

export function PendingVideoList({
  videos,
  onDelete,
  className = "",
}: {
  videos: VideoInfo[]
  onDelete?: (video: VideoInfo) => void
  className?: string
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead className="w-[120px]">Updated at</TableHead>
          <TableHead className="w-[150px]">Title</TableHead>
          <TableHead className="w-[150px]">Description</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <PendingVideoCard
            key={video.id}
            video={video}
            className=""
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  )
}