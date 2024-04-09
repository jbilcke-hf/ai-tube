import Link from "next/link"

import { GrChannel } from "react-icons/gr"
import { MdVideoLibrary } from "react-icons/md"
import { RiHome8Line } from "react-icons/ri"
import { PiRobot } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { showBetaFeatures } from "@/app/config"

import { MenuItem } from "../left-menu/menu-item"

export function MobileBottomMenu() {
  const view = useStore(s => s.view)

  return (
    <div className={cn(
      `flex sm:hidden`,
      `flex-row`,
      `w-full`,
      `justify-between`
    )}>
      <Link href={{
          pathname: '/',
          query: { v: undefined },
        }}>
        <MenuItem
          icon={<RiHome8Line className="h-6 w-6" />}
          selected={view === "home"}
          >
          Discover
        </MenuItem>
      </Link>
      <Link href="/channels">
        <MenuItem
          icon={<GrChannel className="h-5 w-5" />}
          selected={view === "public_channels"}
          >
          Channels
        </MenuItem>
      </Link>
      <Link href="/account">
        <MenuItem
            icon={<CgProfile className="h-6 w-6" />}
            selected={view === "user_account" || view === "user_channel"}
            >
            Account
        </MenuItem>
      </Link>
    </div>
  )
}