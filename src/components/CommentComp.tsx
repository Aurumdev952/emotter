/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type RouterOutputs } from "~/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { TypographyP, TypographySubtle } from "~/components/ui/typography";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from "next/link";
import { UserLink } from "./UserProfileComp";

dayjs.extend(relativeTime)



export const CommentComp: React.FC<RouterOutputs['tweet']["getCommentOnTweets"][0]> = ({content, createdAt, author}) => {
  return (<div className="w-full border-y-[.01rem] border-slate-700">
      <div className="flex items-center justify-start pl-3 gap-2 border-b-[.01rem] border-slate-700 p-3 pt-5">
      <Avatar className="w-6 h-6">
        <AvatarImage src={typeof author.image === "string" ? author.image : undefined} alt={typeof author.name === "string" ? author.name : undefined} />
        <AvatarFallback>{author.name}</AvatarFallback>
      </Avatar>
      {/* <Link href={`/user/${author.id}`} className="text-sm">
        @{typeof author.name === "string" ? author.name : ''}
      </Link> */}
      <UserLink {...author} />

      <TypographySubtle>
        {dayjs(createdAt).fromNow()}
      </TypographySubtle>
      </div>
      <div className="p-3">
        <TypographyP>
            {content}
        </TypographyP>
      </div>
    </div>)
  }