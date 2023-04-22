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
import { useSession  } from "next-auth/react";


export function DialogTweet() {
  const { status } = useSession()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6 gap-1"><Plus /> new post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[40rem] bg-[#0d1726]">
        <DialogHeader>
          <DialogTitle className="text-white">{status !== "unauthenticated" ? (<>New post</>) : (<>log in to post</>)}</DialogTitle>
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
