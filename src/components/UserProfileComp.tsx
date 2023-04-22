import { type RouterOutputs } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
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
import { TypographyH1, TypographyH3, TypographyH4, TypographyP, TypographySubtle } from "./ui/typography";
import { Calendar } from "lucide-react";
import { ColorElement } from "~/utils/colorTypes";
import classNames from "classnames";
dayjs.extend(customParseFormat)

export const UserProfileComp: React.FC<RouterOutputs["user"]["getUser"] & { color: ColorElement["hex"] }> = ({
  id,
  email,
  image,
  name,
  bio,
  color
}) => {
  const { data } = useSession();
  return (
    <div className="w-full h-[23rem] border-b-[.01rem] border-slate-700 relative">
      <div className="h-[10rem] w-full absolute top-0" style={{
        backgroundColor: `#${color}`
      }}></div>
      <div>
        <Avatar className="absolute h-[7rem] w-[7rem] border-2 border-darkblue left-3 top-[6.5rem]">
          <AvatarImage
            src={typeof image === "string" ? image : undefined}
            alt={typeof name === "string" ? name : undefined}
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <div className="absolute flex w-full items-center justify-end gap-2 py-3 pr-5 top-[10rem]">
          {/* button here */}
          <UserProfileMenu />
          <Button className="rounded-3xl border-2 border-white">Follow</Button>
        </div>
      
          <div className="absolute top-[12rem] left-1">
            <TypographyH3>{name ?? ""}</TypographyH3> 
          </div>
          <div className="absolute top-[16rem] w-[90%] pl-1">
            <TypographyP>
              {bio ?? ""}
            </TypographyP>
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
