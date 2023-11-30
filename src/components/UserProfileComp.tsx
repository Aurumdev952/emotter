/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api, type RouterOutputs } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  EllipsisHorizontalIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/solid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  TypographyH3,
  TypographyLead,
  TypographyP,
  TypographySmall,
  TypographySubtle,
} from "./ui/typography";
import { type ColorElement } from "~/utils/colorTypes";

export const UserProfileComp: React.FC<
  RouterOutputs["user"]["getUser"] & { color: ColorElement["hex"] }
> = ({ id, email, image, name, bio, color, following, followers }) => {
  const { data, status } = useSession();
  const [isFollower, setisFollowing] = useState<boolean>(false);
  const [followerCount, setFollowers] = useState<number>(followers.length);

  const follow = api.user.followUser.useMutation({
    onSuccess: () => {
      setisFollowing(true);
      setFollowers((prev) => {
        return prev + 1;
      });
    },
    onError: () => {
      toast.error("error has occured");
    },
  });
  const unfollow = api.user.deleteFollow.useMutation({
    onSuccess: () => {
      setisFollowing(false);
      setFollowers((prev) => {
        return prev - 1;
      });
    },
    onError: () => {
      toast.error("error has occured");
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (data?.user.id !== id) {
        const f = followers.find((r) => r.followerId === data?.user.id);
        if (f) {
          setisFollowing(true);
        }
      }
    }
  }, [status]);
  return (
    <div className="relative h-[23rem] w-full border-b-[.01rem] border-slate-700">
      <div
        className="absolute top-0 h-[10rem] w-full"
        style={{
          backgroundColor: `#${color}`,
        }}
      ></div>
      <div>
        <Avatar className="absolute left-3 top-[6.5rem] h-[7rem] w-[7rem] border-2 border-darkblue">
          <AvatarImage
            src={typeof image === "string" ? image : undefined}
            alt={typeof name === "string" ? name : undefined}
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="absolute top-[10rem] flex w-full items-center justify-end gap-2 py-3 pr-5">
          {/* button here */}
          {!isFollower &&
            status === "authenticated" &&
            data?.user.id !== id && (
              <>
                <UserProfileMenu />
                <Button
                  onClick={() => {
                    if (status === "authenticated") {
                      follow.mutate(id);
                    }
                  }}
                  className="rounded-3xl border-2 border-white"
                >
                  Follow
                </Button>
              </>
            )}
          {isFollower && (
            <Button
              onClick={() => {
                if (status === "authenticated") {
                  unfollow.mutate(id);
                }
              }}
              className="rounded-3xl border-2 border-darkblue bg-white hover:text-white text-darkblue"
            >
              Following
            </Button>
          )}
          {status === "authenticated" && data?.user.id === id && (
            <EditProfileDialog />
          )}
        </div>

        <div className="absolute left-1 top-[12rem]">
          <TypographyH3>{name ?? ""}</TypographyH3>
        </div>
        <div className="absolute top-[16rem] w-[90%] pl-1">
          <TypographyP>{bio ?? ""}</TypographyP>
        </div>
        <div className="absolute left-4 top-[21rem] flex items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-1">
            <TypographySmall>{following.length.toString()}</TypographySmall>
            <TypographySubtle>Following</TypographySubtle>
          </div>
          <div className="flex items-center justify-center gap-1">
            <TypographySmall>{followerCount.toString()}</TypographySmall>
            <TypographySubtle>Followers</TypographySubtle>
          </div>
        </div>
      </div>
    </div>
  );
};

export function UserProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-white text-center text-white">
          <EllipsisHorizontalIcon className="h-4 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer hover:bg-slate-700">
            <NoSymbolIcon className="mr-2 h-4 w-4" />
            <span>Block user</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { CalendarDays } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { EditProfileDialog } from "./EditProfileDialog";

export const UserLink: React.FC<{
  image: string | null;
  id: string;
  name: string | null;
  bio: string | null;
  followers: RouterOutputs["user"]["getUser"]["followers"];
  following: RouterOutputs["user"]["getUser"]["following"];
}> = ({ image, id, bio, name, followers, following }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={`/user/${id}`}
          className="text-sm font-medium leading-none text-white hover:underline"
        >
          @{typeof name === "string" ? name : ""}
        </Link>
        {/* <Button variant="link">@nextjs</Button> */}
      </HoverCardTrigger>
      {bio && (
        <HoverCardContent className="w-70 bg-darkblue">
          <div className="flex justify-center space-x-4">
            <Avatar>
              <AvatarImage src={image ?? ""} />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{name}</h4>
              <p className="text-sm">
                {/* The React Framework – created and maintained by @vercel. */}
                {bio ?? ""}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center justify-center gap-1">
                  <TypographySmall>
                    {following?.length.toString() ?? 0}
                  </TypographySmall>
                  <TypographySubtle>Following</TypographySubtle>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <TypographySmall>
                    {followers?.length.toString() ?? 0}
                  </TypographySmall>
                  <TypographySubtle>Followers</TypographySubtle>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      )}
      {!bio && (
        <HoverCardContent className="w-70 bg-darkblue">
          <div className="flex justify-center space-x-4">
            <Avatar>
              <AvatarImage src={image ?? ""} />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@{name}</h4>
              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center justify-center gap-1">
                  <TypographySmall>
                    {following?.length.toString() ?? 0}
                  </TypographySmall>
                  <TypographySubtle>Following</TypographySubtle>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <TypographySmall>
                    {followers?.length.toString() ?? 0}
                  </TypographySmall>
                  <TypographySubtle>Followers</TypographySubtle>
                </div>
              </div>
            </div>
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};
