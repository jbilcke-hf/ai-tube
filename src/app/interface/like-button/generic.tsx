import { RiThumbUpLine } from "react-icons/ri"
import { RiThumbUpFill } from "react-icons/ri"
import { RiThumbDownLine } from "react-icons/ri"
import { RiThumbDownFill } from "react-icons/ri"

import { cn } from "@/lib/utils"

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


  return (
    <div className={classNames}>
      <div className={cn(
        `flex flex-row items-center justify-center`,
        `cursor-pointer rounded-l-full overflow-hidden`,
        `hover:bg-neutral-700/90`,
        `space-x-1.5 lg:space-x-2 pl-2 lg:pl-3 pr-3 lg:pr-4 h-8 lg:h-9`
        )}
        onClick={() => {
          try {
            onLike?.()
          } catch (err) {

          }}}
        >
        <div>{
          isLikedByUser ? <RiThumbUpFill /> :  <RiThumbUpLine />
        }</div>
        <div>{numberOfLikes}</div>
      </div>
      <div className={cn(
        `flex flex-row items-center justify-center`,
        `cursor-pointer rounded-r-full overflow-hidden`,
        `hover:bg-neutral-700/90`,
        `space-x-1.5 lg:space-x-2 pl-2 lg:pl-3 pr-3 lg:pr-4 h-8 lg:h-9`
      )}
      onClick={() => {
        try {
          onDislike?.()
        } catch (err) {

        }}}
      >
        <div>{
          isDislikedByUser ? <RiThumbDownFill /> :  <RiThumbDownLine />
        }</div>
        <div>{numberOfDislikes}</div>
      </div>
    </div>
  )
}