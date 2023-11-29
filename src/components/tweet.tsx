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
} from "~/components/ui/dialog";
import { NewComment } from "./NewComment";
import { type RouterOutputs } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  TypographyP,
  TypographySmall,
  TypographySubtle,
} from "~/components/ui/typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Link from "next/link";
import classNames from "classnames";
import { toast } from "react-hot-toast";
import { UserLink } from "./UserProfileComp";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import Linkify from "linkify-react";
dayjs.extend(relativeTime);

export const Tweet: React.FC<RouterOutputs["tweet"]["getAllTweets"][0]> = ({
  content,
  createdAt,
  id,
  author,
  likedBy,
  comments,
  images,
}) => {
  const { data, status } = useSession();
  const user = data?.user;
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(likedBy.length);
  const [commentsCount, setComments] = useState<number>(comments.length);
  const [commentState, setCommentstate] = useState<boolean>(false);
  const likepost = api.tweet.likeTweet.useMutation();
  const unlikePost = api.tweet.unlikeTweet.useMutation();

  const updatedComment = () => {
    setComments((prev) => {
      return prev + 1;
    });
    setCommentstate(false);
  };

  useEffect(() => {
    const user = data?.user;

    if (user === undefined) {
      setPostLiked(false);
    } else {
      const is_liked = likedBy.find((like) => like.userId === user?.id);
      setPostLiked(is_liked !== undefined ? true : false);
    }
  }, [status]);

  useEffect(() => {
    if (likepost.status === "success") {
      setLikes((prev) => {
        return prev + 1;
      });
      setPostLiked(true);
      toast.success("Success liking");
    } else if (likepost.status === "error") {
      setLikes((prev) => {
        return prev - 1;
      });
      setPostLiked(false);
      toast.error("error liking post");
    }
  }, [likepost.status]);
  useEffect(() => {
    if (unlikePost.status === "success") {
      setLikes((prev) => {
        return prev - 1;
      });
      setPostLiked(false);
    } else if (unlikePost.status === "error") {
      setLikes((prev) => {
        return prev + 1;
      });
      setPostLiked(true);
      toast.error("error unliking post");
    }
  }, [unlikePost.status, unlikePost.isLoading]);
  return (
    <div className="w-full rounded-md border-[.1rem] border-slate-300 p-2">
      <div className="flex items-center justify-start gap-2 border-b-[.01rem] border-slate-700 p-3 pl-3 pt-0">
        <Avatar>
          <AvatarImage
            src={typeof author.image === "string" ? author.image : undefined}
            alt={typeof author.name === "string" ? author.name : undefined}
          />
          <AvatarFallback>{author.name}</AvatarFallback>
        </Avatar>
        <UserLink {...author} />
        <TypographySubtle>{dayjs(createdAt).fromNow()}</TypographySubtle>
      </div>
      <Link href={`/post/${id}`} className="p-5">
        <TypographyP>
          <Linkify
            as="p"
            options={{
              className: "text-blue-700 hover:underline",
              attributes: {
                target: "_blank"
              }
            }}
          >
            {content}
          </Linkify>
        </TypographyP>
        {images.length > 0 && (
          <div className="mt-2 flex flex-col items-center justify-center">
            {images.map((image, i) => (
              <Image
                src={image.url}
                alt="image"
                height={450}
                width={360}
                key={i}
                className="w-[95%] rounded-md"
                // placeholder="blur"
              />
            ))}
          </div>
        )}
      </Link>
      <div className="grid grid-cols-2 grid-rows-1 border-t-[.01rem] border-slate-700 p-2">
        <div className="flex items-center justify-center gap-4">
          <TypographySmall>{likes.toString()}</TypographySmall>
          <button
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-100",
              {
                "bg-slate-100 bg-opacity-10 hover:bg-opacity-5": postLiked,
                "bg-transparent hover:bg-slate-100 hover:bg-opacity-10":
                  !postLiked,
              }
            )}
            onClick={() => {
              if (user !== undefined) {
                if (!postLiked) {
                  likepost.mutate({
                    tweetId: id,
                    // userId: user.id,
                  });
                } else {
                  unlikePost.mutate({
                    tweetId: id,
                    // userId: user.id,
                  });
                }
              }
            }}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-4">
          <TypographySmall>{commentsCount.toString()}</TypographySmall>
          <Dialog onOpenChange={setCommentstate} open={commentState}>
            <DialogTrigger asChild>
              <button
                className={classNames(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors duration-100 hover:bg-slate-100 hover:bg-opacity-10"
                )}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0d1726] sm:max-w-[40rem]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {status !== "unauthenticated" ? (
                    <>New Comment</>
                  ) : (
                    <>log in to comment</>
                  )}
                </DialogTitle>
              </DialogHeader>
              {/* <NewTweet /> */}
              <NewComment tweetId={id} updateComment={updatedComment} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
