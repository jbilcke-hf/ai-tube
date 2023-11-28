import { GrChannel } from "react-icons/gr"
import { MdVideoLibrary } from "react-icons/md"
import { RiHome8Line } from "react-icons/ri"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { MenuItem } from "./menu-item"

export function LeftMenu() {
  const view = useStore(s => s.view)
  const setView = useStore(s => s.setView)
  return (
    <div className={cn(
      `flex flex-col items-center`,
      `justify-items-stretch`,
      `w-24 px-1 pt-4`,
     // `bg-orange-500`,
    )}>
      <MenuItem
        icon={<RiHome8Line className="h-6 w-6" />}
        selected={view === "home"}
        onClick={() => setView("home")}
        >
        Home
      </MenuItem>
      <MenuItem
        icon={<GrChannel className="h-5 w-5" />}
        selected={view === "channels_public"}
        onClick={() => setView("channels_public")}
        >
        Channels
      </MenuItem>
      <MenuItem
        icon={<MdVideoLibrary className="h-6 w-6" />}
        selected={
          view === "channels_admin" ||
          view === "channel_admin"
        }
        onClick={() => setView("channels_admin")}
        >
        My Content
      </MenuItem>
    </div>
    )
}