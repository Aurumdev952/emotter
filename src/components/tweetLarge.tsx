import { type RouterOutputs } from "~/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { TypographyP, TypographySmall, TypographySubtle } from "~/components/ui/typography";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
dayjs.extend(relativeTime)



export const TweetLarge: React.FC<RouterOutputs['tweet']['getAllTweets'][0]> = ({content, createdAt, id, author, likedBy}) => {
  const { data } = useSession()
  const user = data?.user
  const [postLiked, setPostLiked] = useState<boolean>(() => {
    if (user === undefined) return false
    let is_liked = false
    likedBy.forEach(like => {
      if (like.userId === user.id) {
        is_liked = true
      }
    })
    return is_liked
  })
  const [likes, setLikes] = useState<number>(likedBy.length)
  const likepost = api.tweet.likeTweet.useMutation({
    onSuccess: () => {
      setLikes((prev) => {
        return prev + 1
      })
      setPostLiked(true)
    }
  })
  const unlikePost = api.tweet.unlikeTweet.useMutation({
    onSuccess: () => {
      setLikes((prev) => {
        return prev - 1
      })
      setPostLiked(false)
    }
  })



  return (<div className="w-full">
      <div className="flex items-center justify-start pl-3 gap-2 border-b-[.01rem] border-slate-700 p-3 pt-5">
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
      <div className="p-5">
        <TypographyP>
            {content}
        </TypographyP>
      </div>
      <div className="grid grid-cols-2 grid-rows-1 border-y-[.01rem] p-2 border-slate-700">
        <div className="flex justify-center items-center gap-4">
          <TypographySmall>{likes.toString()}</TypographySmall>
          <button className={
            postLiked ? "w-10 h-10 rounded-full bg-slate-100 bg-opacity-10 hover:bg-transparent flex justify-center items-center duration-100 transition-colors" : "w-10 h-10 rounded-full bg-transparent hover:bg-slate-100 hover:bg-opacity-10 flex justify-center items-center"
        }
        onClick={() => {
          if (user !== undefined) {
            if (!postLiked) {
              likepost.mutate({
                tweetId: id,
                userId: user.id,
              })
            } else {
              unlikePost.mutate({
                tweetId: id,
                userId: user.id,
              })
            }
          }
        }}
        ><ThumbsUp className="h-4 w-4" /></button>
        </div>
      </div>
    </div>)
  }