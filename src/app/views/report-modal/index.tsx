import { ReactNode, useState } from "react"
import { LuShieldAlert } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog"

import { ChannelInfo, VideoInfo } from "@/types"
import { ActionButton } from "@/app/interface/action-button"

// modal to report a video or channel
export function ReportModal({
    video,
    channel,
    children,
  }: {
    video?: VideoInfo
    channel?: ChannelInfo
    children?: ReactNode
  }) {
  const [isOpen, setOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setOpen(open)
      }
    }}>
      <DialogTrigger asChild>
      <ActionButton onClick={() => setOpen(true)}>
          <LuShieldAlert className="w-5 h-5" />
          <span>Report</span>
        </ActionButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[512px] text-zinc-200 overflow-y-scroll">
        <DialogHeader>
          <DialogDescription className="w-full text-center text-lg font-normal text-stone-300">
            Report an issue with the content
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full space-y-3">
          <p className="text-sm">If you believe there is an issue with a content, you can ask the author to remove it, by creating a pull request explaining why:</p>

          <div className="flex flex-row py-2">
            {video && video.id ? <ActionButton
              href={
                `https://huggingface.co/datasets/${
                  video.channel.datasetUser
                }/${
                  video.channel.datasetName
                }/delete/main/prompt_${
                  video.id
                }.md`
                  }
                >
                <span>Request author for content removal</span>
              </ActionButton>
            : null}
          </div>

          <p className="text-sm">
            Note: it may take some time for the AiTube robot to synchronize and delete the video.
          </p>

          <p className="text-sm">
            If the content is in violation of <a href="https://huggingface.co/content-guidelines" target="_blank">our content guidelines</a>,
            you can flag the channel from the Hugging Face dataset page:
          </p>

          <div className="flex flex-row py-2">
          {video && video.id ? <ActionButton
            href={
              `https://huggingface.co/datasets/${
                video.channel.datasetUser
              }/${
                video.channel.datasetName
              }`
                }
              >
              <span>Click here to open the dataset</span>
            </ActionButton>
          : null}

  
          {channel && channel.id ? <ActionButton
            href={
              `https://huggingface.co/datasets/${
                channel.datasetUser
              }/${
                channel.datasetName
              }`
                }
              >
              <span>Click here to open the dataset</span>
            </ActionButton>
            : null}
          </div>

          <div className="flex flex-col items-center justify-center">
            <img src="/report.jpg" className="rounded w-[280px]" />
          </div>

            <p className="text-sm">
            Finally, if you believe the content violates or infringes your intellectual property rights,
            you may <span className="text-medium">send your complaint</span> to <a href="mailto:dmca@huggingface.co" target="_blank" className="font-mono text-xs bg-neutral-200 rounded-lg text-neutral-700 px-1 py-0.5">dmca@huggingface.co</a> with detailed and accurate information supporting your claim,
            in addition to the possibility of flagging the allegedly infringing Content.
            
            You also represent and warrant that you will not knowingly provide misleading information to support your claim.
          </p>
          </div>
        <DialogFooter>
        <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}
          >
          Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}