import { cn } from "@/lib/utils/cn"

export default async function Embed() {
  return (
    <div className={cn(
      `w-full`,
      `flex flex-col`
    )}>
      <a href={process.env.NEXT_PUBLIC_DOMAIN || "#"}>Please go to AiTube.at to fully enjoy this experience.</a>
    </div>
   )
}