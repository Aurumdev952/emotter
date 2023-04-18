"use client"

import { Plus } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { NewTweet } from "./newtweet"


export function DialogTweet() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:text-[#0d1726] w-[10rem]"><Plus /> new post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40rem] bg-[#0d1726]">
        <DialogHeader>
          <DialogTitle className="text-white">New post</DialogTitle>
          {/* <DialogDescription>
            
          </DialogDescription> */}
        </DialogHeader>
        <NewTweet />
        {/* <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">

          </div>
        </div> */}
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
