import { type RouterOutputs } from "~/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { TypographyP, TypographySmall, TypographySubtle } from "~/components/ui/typography";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ThumbsUp } from "lucide-react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import { toast } from 'react-hot-toast'
dayjs.extend(relativeTime)

// TODO check if post is liked at the server because the post is not initially liked due to SSR😢

export const Tweet: React.FC<RouterOutputs['tweet']['getAllTweets'][0]> = ({content, createdAt, id, author, likedBy}) => {
  const { data } = useSession()
  const user = data?.user
  const [postLiked, setPostLiked] = useState<boolean>(() => {
    if (user === undefined) return false
    const is_liked = likedBy.find(like => like.userId === user.id)
    // likedBy.forEach(like => {
    //   if (like.userId === user.id) {
    //     is_liked = true
    //   }
    // })
    return is_liked !== undefined ? true : false
  })
  const [likes, setLikes] = useState<number>(likedBy.length)
  const likepost = api.tweet.likeTweet.useMutation({
    onSuccess: () => {
      setLikes((prev) => {
        return prev + 1
      })
      setPostLiked(true)
      toast.success("Success liking")
    },
    onError: ({ data }) => {
      // setLikes((prev) => {
      //   return prev - 1
      // })
      // setPostLiked(false)
      toast.error("error liking post")
    }
  })
  const unlikePost = api.tweet.unlikeTweet.useMutation({
    onSuccess: () => {
      setLikes((prev) => {
        return prev - 1
      })
      setPostLiked(false)
    },
    onError: () => {
      // setLikes((prev) => {
      //   return prev + 1
      // })
      // setPostLiked(true)
      toast.error("error unliking post")
    },
    
  })


  
  return (<div className="w-full border-[.1rem] p-2 rounded-md border-slate-300">
      <div className="flex items-center justify-start pl-3 pt-0 gap-2 border-b-[.01rem] border-slate-700 p-3">
      <Avatar>
        <AvatarImage src={typeof author.image === "string" ? author.image : undefined} alt={typeof author.name === "string" ? author.name : undefined} />
        <AvatarFallback>{author.name}</AvatarFallback>
      </Avatar>
      
        <Link href={`/user/${author.id}`} className="text-sm font-medium leading-none">
          @{typeof author.name === "string" ? author.name : ''}
        </Link>
  
      <TypographySubtle>
        {dayjs(createdAt).fromNow()}
      </TypographySubtle>
      </div>
      <Link href={`/post/${id}`} className="p-5">
        <TypographyP>
            {content}
        </TypographyP>
      </Link>
      <div className="grid grid-cols-2 grid-rows-1 border-t-[.01rem] p-2 border-slate-700">
        <div className="flex justify-center items-center gap-4">
          <TypographySmall>{likes.toString()}</TypographySmall>
          <button 
          className={classNames("w-10 h-10 rounded-full flex justify-center items-center duration-100 transition-colors",
          {
            "bg-slate-100 bg-opacity-10 hover:bg-opacity-5": postLiked,
            "bg-transparent hover:bg-slate-100 hover:bg-opacity-10": !postLiked
          })}
        onClick={() => {
          if (user !== undefined) {
            if (!postLiked) {
              likepost.mutate({
                tweetId: id,
                // userId: user.id,
              })
            } else {
              unlikePost.mutate({
                tweetId: id,
                // userId: user.id,
              })
            }
          }
        }}
        ><ThumbsUp className="h-4 w-4" /></button>
        </div>
      </div>
    </div>)
  }