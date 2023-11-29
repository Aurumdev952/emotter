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
import { ProfileForm } from "./ProfileForm";
export function EditProfileDialog() {
  const { status, data } = useSession();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="border-darkblue text-darkblue rounded-3xl border-2 bg-white">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0d1726] sm:max-w-[40rem]">
        <DialogHeader>
          <DialogTitle className="text-white">Edit profile</DialogTitle>
          <ProfileForm />
          {/* <DialogDescription>

          </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
