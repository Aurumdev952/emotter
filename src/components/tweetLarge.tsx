/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { NewComment } from "./NewComment";
import { type RouterOutputs } from "~/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { TypographyP, TypographySmall, TypographySubtle } from "~/components/ui/typography";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { toast } from 'react-hot-toast'
import classNames from "classnames";
import Link from "next/link";

dayjs.extend(relativeTime)



export const TweetLarge: React.FC<RouterOutputs['tweet']['getAllTweets'][0]> = ({content, createdAt, id, author, likedBy, comments}) => {
  const { data, status } = useSession()
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
  const [commentsCount, setComments] = useState<number>(comments.length);
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


  const updatedComment = () => {
    setComments(prev => {
      return prev + 1
    })
    // setCommentstate(false)
  }
  return (<div className="w-full">
      <div className="flex items-center justify-start pl-3 gap-2 border-b-[.01rem] border-slate-700 p-3 pt-5">
      <Avatar>
        <AvatarImage src={typeof author.image === "string" ? author.image : undefined} alt={typeof author.name === "string" ? author.name : undefined} />
        <AvatarFallback>{author.name}</AvatarFallback>
      </Avatar>

      {/* <Link href className="text-sm font-medium leading-none">
          @{typeof author.name === "string" ? author.name : ''}
        </Link> */}
      <Link href={`/user/${author.id}`}>
        @{typeof author.name === "string" ? author.name : ''}
      </Link>

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
              })
            } else {
              unlikePost.mutate({
                tweetId: id,
              })
            }
          }
        }}
        ><ThumbsUp className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <TypographySmall>{commentsCount.toString()}</TypographySmall>
          <button
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-100 bg-transparent"
            )}
          >
            <MessageSquare className="h-4 w-4" />
          </button>  
        </div>
      </div>
      <div className="border-b-[.01rem] p-2 border-slate-700">
        <NewComment tweetId={id} updateComment={updatedComment} />
      </div>
    </div>)
  }