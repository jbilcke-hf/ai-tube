import Link from "next/link"
import { TbBrandDiscord, TbOctahedron } from "react-icons/tb"
import { AiOutlineQuestionCircle } from "react-icons/ai"
import { GrChannel } from "react-icons/gr"
import { MdOutlineLiveTv, MdOutlineVideogameAsset, MdVideoLibrary } from "react-icons/md"
import { RiHome8Line } from "react-icons/ri"
import { PiRobot } from "react-icons/pi"
import { CgProfile } from "react-icons/cg"
import { MdOutlinePlayCircleOutline } from "react-icons/md";

import { useStore } from "@/app/state/useStore"
import { cn } from "@/lib/utils/cn"
import { showBetaFeatures } from "@/app/config"

import { MenuItem } from "./menu-item"
import { About } from "../about"

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
        <Link href="/music">
          <MenuItem
            icon={<MdOutlinePlayCircleOutline className="h-6.5 w-6.5" />}
            selected={view === "public_music_videos"}
            >
            Music
          </MenuItem>
        </Link>
        {/*
        <Link href="/gaming">
          <MenuItem
            icon={<TbOctahedron className="h-6.5 w-6.5" />}
            selected={view === "public_4d"}
            >
            4D
          </MenuItem>
        </Link>
        <Link href="/gaming">
          <MenuItem
            icon={<MdOutlineVideogameAsset className="h-6.5 w-6.5" />}
            selected={view === "public_gaming"}
            >
            Gaming
          </MenuItem>
        </Link>
        <Link href="/live">
          <MenuItem
            icon={<MdOutlineLiveTv className="h-6.5 w-6.5" />}
            selected={view === "public_live"}
            >
            Live
          </MenuItem>
        </Link>
        */}
      </div>
      <div className={cn(
        `flex flex-col w-full`,
       
      )}>
        {/*<MenuItem
          icon={<MdVideoLibrary className="h-6 w-6" />}
          selected={view === "user_medias"}
          onClick={() => setView("user_medias")}
          >
          My Videos
        </MenuItem>
      */}
        <About />
        <a href="https://discord.gg/Q6mJ2rnDPe" target="_blank">
          <MenuItem
            icon={<TbBrandDiscord className="h-6 w-6" />}
            >
            Community
          </MenuItem>
        </a>
           {/*
      currently disabled using AiTube 2 gets out
      
        <Link href="/account">
          <MenuItem
            icon={<CgProfile className="h-6 w-6" />}
            selected={view === "user_account" || view === "user_channel"}
            >
            Account
          </MenuItem>
        </Link>
    */}
      </div>
    </div>
    )
}