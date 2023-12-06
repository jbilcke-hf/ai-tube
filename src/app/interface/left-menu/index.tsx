import { GrChannel } from "react-icons/gr"
import { MdVideoLibrary } from "react-icons/md"
import { RiHome8Line } from "react-icons/ri"
import { PiRobot } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { MenuItem } from "./menu-item"
import { showBetaFeatures } from "@/app/config"


export function LeftMenu() {
  const view = useStore(s => s.view)
  const setView = useStore(s => s.setView)
  const menuMode = useStore(s => s.menuMode)
  const setMenuMode = useStore(s => s.setMenuMode)

  return (
    <div className={cn(
      `flex flex-col`,
      `w-24 px-1 pt-4`,
      `justify-between`
     // `bg-orange-500`,
    )}>
      <div className={cn(
        `flex flex-col w-full`,
      )}>
        <MenuItem
          icon={<RiHome8Line className="h-6 w-6" />}
          selected={view === "home"}
          onClick={() => setView("home")}
          >
          Discover
        </MenuItem>
        <MenuItem
          icon={<GrChannel className="h-5 w-5" />}
          selected={view === "public_channels"}
          onClick={() => setView("public_channels")}
          >
          Channels
        </MenuItem>
      </div>
      <div className={cn(
        `flex flex-col w-full`,
       
      )}>
        {/*<MenuItem
          icon={<MdVideoLibrary className="h-6 w-6" />}
          selected={view === "user_videos"}
          onClick={() => setView("user_videos")}
          >
          My Videos
        </MenuItem>
      */}
        {showBetaFeatures && <MenuItem
          icon={<CgProfile className="h-6 w-6" />}
          selected={view === "user_channels"}
          onClick={() => setView("user_channels")}
          >
          Account
        </MenuItem>}
      </div>
    </div>
    )
}