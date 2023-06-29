"use client";

import { ImageIcon, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { NewTweet } from "./newtweet";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
export function DialogTweet() {
  const { status } = useSession();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-[10rem] justify-start gap-1 pl-6 hover:text-[#0d1726]">
          <Plus /> new post
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0d1726] sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {status !== "unauthenticated" ? <>New post</> : <>log in to post</>}
          </DialogTitle>
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
  );
}
export function ImageDialog({ image, setImage }: {image: {
  image: string,
  file: File
} | undefined, setImage: Dispatch<SetStateAction<{
  image: string,
  file: File
} | undefined>>}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-slate-200">
          <ImageIcon className="text-darkblue" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0d1726] sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-white">Image Upload</DialogTitle>
          <DialogDescription>select image to post</DialogDescription>
        </DialogHeader>
        {!image &&
          <div className="flex w-full items-center justify-center">
            <label
              htmlFor="dropzone-file"
              className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  aria-hidden="true"
                  className="mb-3 h-10 w-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input id="dropzone-file" type="file" className="hidden"  accept="jpeg,.jpg,.png,image/jpeg,image/png,.svg" onChange={(e) => {
                const file = e.target.files
                if (file && file[0] !== undefined) {
                  setImage({
                    image: URL.createObjectURL(file[0]),
                    file: file[0]
                  })
                  
                }
              }} />
            </label>
          </div>
        }
        {image && <div className="w-full flex flex-col justify-center items-center">
          <Image src={image.image} alt="image preview" width={720} height={630} />
          </div>}
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
