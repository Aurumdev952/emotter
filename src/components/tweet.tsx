import { RouterOutputs } from "~/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { TypographyH1, TypographyH3, TypographyH4, TypographyLead, TypographyP, TypographySmall, TypographySubtle } from "~/components/ui/typography";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)



export const Tweet: React.FC<RouterOutputs['tweet']['getAllTweets'][0]> = ({authorId, content, createdAt, id, author}) => {
    return (<div className="w-full border-[.1rem] p-2 rounded-md border-slate-300">
      <div className="flex items-center justify-start pl-3 pt-0 gap-2 border-b-[.01rem] border-slate-700 p-3">
      <Avatar>
        <AvatarImage src={typeof author.image === "string" ? author.image : undefined} alt={typeof author.name === "string" ? author.name : undefined} />
        <AvatarFallback>{author.name}</AvatarFallback>
      </Avatar>
      <TypographySmall>
        @{typeof author.name === "string" ? author.name : ''}
      </TypographySmall>
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