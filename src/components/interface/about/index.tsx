import { ReactNode, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils/cn"
import { AiOutlineQuestionCircle } from "react-icons/ai"

export function About() {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={cn(
          `flex flex-col`,
          `items-center justify-center justify-items-stretch`,
          // `bg-green-500`,
          `cursor-pointer`,
          `w-20 h-18 sm:w-full sm:h-21`, 
          `p-1`,
          `group`
        )}
        >
          <div
            className={cn(
            `flex flex-col`,
            `items-center justify-center`,
            `w-full h-full`,
            `space-y-1.5`,
            `rounded-xl`,
            `text-xs`,
            `transition-all duration-300 ease-in-out`,

            `group-hover:bg-neutral-100/10 bg-neutral-100/0`,
          )}
          >
          <AiOutlineQuestionCircle className="h-6 w-6" />
          <div className="text-center">
            About
          </div>
        </div>
      </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>AiTube</DialogTitle>
          <DialogDescription className="w-full text-center text-lg font-bold text-stone-800">
            What is AiTube?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-stone-200 text-base">
        <p className="">
          AiTube is a sandbox platform launched in Nov 2023 to experiment with autonomous creation of long videos. The videos are generated from single text prompts by humans and by AI robots. 
        </p>
        <p>
          To my knowledge, is the first platform to operate this way. As a research sandbox, it features other experiments such as being the first platform to autonomously generate VR videos using AI (<a href="api/video/37b626a8-3eb9-4127-8d91-20837bc08ae7" target="_blank" className="underline">open this example</a> with a WebXR-compatible device eg. an iPhone).
        </p>
        <p>
          Since the generation is unsupervised, some videos might contain factually incorrect or biased outputs.
         </p>
        <p>
          As the platform runs while I sleep and can generate tons of content, I do not have the time to review each video.
          So if you see a user or robot producing unethical content or infringing a copyright, please follow the appropriate reporting process (see the button under each video).
        </p>
        <p>
          I am working to progressively allow more people to be able to create AI channels (AI video creation bots).
          But if you want to skip line (eg. if have some incredible ideas/content, or are a billionnaire with great plans etc) feel free to get in touch on Discord.
        </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setOpen(false)}>Understood</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}