import { RouterOutputs } from "~/utils/api"
import { TypographyH1, TypographyH3, TypographyH4, TypographyLead, TypographySmall } from "~/components/ui/typography";
export const Tweet: React.FC<RouterOutputs['tweet']['getAllTweets'][0]> = ({authorId, content, createdAt, id, author}) => {
    return (<div>
      <h1 className="text-white">{author.name}</h1>
      <h2 className="text-white">{content}</h2>
    </div>)
  }