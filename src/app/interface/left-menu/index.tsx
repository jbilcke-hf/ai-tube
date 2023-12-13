import Link from "next/link"

import { GrChannel } from "react-icons/gr"
import { MdVideoLibrary } from "react-icons/md"
import { RiHome8Line } from "react-icons/ri"
import { PiRobot } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"
import { HiOutlineMusicNote } from "react-icons/hi"

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils"
import { showBetaFeatures } from "@/app/config"

import { MenuItem } from "./menu-item"

export function LeftMenu() {
  const view = useStore(s => s.view)

  return (
    <div className={cn(
      `hidden sm:flex`,
       `flex-col`,
      `w-24 px-1 pt-4`,
      `justify-between`
     // `bg-orange-500`,
    )}>
      <div className={cn(
        `flex flex-col w-full`,
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
        {/*
        <Link href="/music">
          <MenuItem
            icon={<HiOutlineMusicNote className="h-5 w-5" />}
            selected={view === "public_music_videos"}
            >
            Music
          </MenuItem>
        </Link>
        */}
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
        <Link href="/account">
          <MenuItem
            icon={<CgProfile className="h-6 w-6" />}
            selected={view === "user_account" || view === "user_channel"}
            >
            Account
          </MenuItem>
        </Link>
      </div>
    </div>
    )
}