import { RiThumbUpLine } from "react-icons/ri"
import { RiThumbUpFill } from "react-icons/ri"
import { RiThumbDownLine } from "react-icons/ri"
import { RiThumbDownFill } from "react-icons/ri"

import { cn } from "@/lib/utils/cn"
import { formatLargeNumber } from "@/lib/formatters/formatLargeNumber"

export const likeButtonClassName = cn(
  `flex flex-row`,
  `items-center justify-center text-center`,
  `h-8 lg:h-9`,
  `rounded-2xl`,
  `text-xs lg:text-sm font-medium`,
  `bg-neutral-700/50 text-zinc-100`,
)

export function GenericLikeButton({
  className,
  onLike,
  onDislike,
  isLikedByUser = false,
  isDislikedByUser = false,
  numberOfLikes = 0,
  numberOfDislikes = 0,
}: {
  className?: string
  onLike?: () => void
  onDislike?: () => void
  isLikedByUser?: boolean
  isDislikedByUser?: boolean
  numberOfLikes?: number
  numberOfDislikes?: number
}) {

  const classNames = cn(
    likeButtonClassName,
    className,
  )

  const nbLikes = Math.max(0, numberOfLikes)
  const nbDislikes = Math.max(0, numberOfDislikes)

  return (
    <div className={classNames}>
      <div className={cn(
        `flex flex-row items-center justify-center`,
        `cursor-pointer rounded-l-full overflow-hidden`,
        `hover:bg-neutral-700/90`,
        `space-x-1.5 lg:space-x-2 pl-2 lg:pl-3 pr-1 lg:pr-1 h-8 lg:h-9`
        )}
        onClick={() => {
          try {
            if (!isLikedByUser) onLike?.()
          } catch (err) {

          }}}
        >
        <div>{
          isLikedByUser
          ? <RiThumbUpFill className="w-5 h-5" />
          : <RiThumbUpLine className="w-5 h-5" />
        }</div>
        <div>{nbLikes > 0 ? formatLargeNumber(nbLikes) : ""}</div>
      </div>
      <div className={cn(
        `flex flex-row items-center justify-center`,
        `cursor-pointer rounded-r-full overflow-hidden`,
        `hover:bg-neutral-700/90`,
        `space-x-1.5 lg:space-x-2 pl-2 lg:pl-3 pr-2 lg:pr-3 h-8 lg:h-9`
      )}
      onClick={() => {
        try {
          if (!isDislikedByUser) onDislike?.()
        } catch (err) {

        }}}
      >
        <div className="border-l border-l-zinc-600 h-[70%]">&nbsp;</div>
        <div>{
          isDislikedByUser
          ? <RiThumbDownFill className="w-5 h-5" />
          : <RiThumbDownLine className="w-5 h-5" />
        }</div>
        <div>{nbDislikes > 0 ? formatLargeNumber(numberOfDislikes) : ""}</div>
      </div>
    </div>
  )
}