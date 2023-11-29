/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { toast } from "react-hot-toast";
import classNames from "classnames";
import { UserLink } from "./UserProfileComp";
import Image from "next/image";
import Linkify from "linkify-react";
dayjs.extend(relativeTime);

export const TweetLarge: React.FC<
  RouterOutputs["tweet"]["getAllTweets"][0]
> = ({ content, createdAt, id, author, likedBy, comments, images }) => {
  const { data, status } = useSession();
  const user = data?.user;
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(likedBy.length);
  const [commentsCount, setComments] = useState<number>(comments.length);
  const likepost = api.tweet.likeTweet.useMutation();
  const unlikePost = api.tweet.unlikeTweet.useMutation();

  const updatedComment = () => {
    setComments((prev) => {
      return prev + 1;
    });
    // setCommentstate(false)
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
    <div className="w-full">
      <div className="flex items-center justify-start gap-2 border-b-[.01rem] border-slate-700 p-3 pl-3 pt-5">
        <Avatar>
          <AvatarImage
            src={typeof author.image === "string" ? author.image : undefined}
            alt={typeof author.name === "string" ? author.name : undefined}
          />
          <AvatarFallback>{author.name}</AvatarFallback>
        </Avatar>

        {/* <Link href className="text-sm font-medium leading-none">
          @{typeof author.name === "string" ? author.name : ''}
        </Link> */}
        {/* <Link href={`/user/${author.id}`}>
        @{typeof author.name === "string" ? author.name : ''}
      </Link> */}
        <UserLink {...author} />

        <TypographySubtle>{dayjs(createdAt).fromNow()}</TypographySubtle>
      </div>
      <div className="p-5">
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
          <div className="mt-2">
            {images.map((image, i) => (
              <Image
                src={image.url}
                alt="image"
                height={360}
                width={640}
                key={i}
                className="w-[95%] rounded-md"
                priority
                // placeholder="blur"
              />
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 grid-rows-1 border-y-[.01rem] border-slate-700 p-2">
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
                  });
                } else {
                  unlikePost.mutate({
                    tweetId: id,
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
          <button
            className={classNames(
              "flex h-10 w-10 items-center justify-center rounded-full bg-transparent transition-colors duration-100"
            )}
          >
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="border-b-[.01rem] border-slate-700 p-2">
        <NewComment tweetId={id} updateComment={updatedComment} />
      </div>
    </div>
  );
};
