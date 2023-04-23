import { TypographySmall } from "~/components/ui/typography";
import { Textarea } from "~/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Input } from "./ui/input";

export const NewComment: React.FC<{
  tweetId: string;
  updateComment: () => void;
}> = ({ tweetId, updateComment }) => {
  const { data, status } = useSession();
  const utils = api.useContext();
  const [content, setContent] = useState<string>("");
  const [iscommenting, setIscommenting] = useState<boolean>(false);
  const newtweet = api.tweet.commentOntweet.useMutation({
    onSuccess: async () => {
      setIscommenting(false);
      await utils.tweet.getCommentOnTweets.refetch()
      updateComment();
      setContent("");
      toast.success("comment created sucessfully");
    },
    onError: () => {
      toast.error("error commenting");
    },
  });

  if (status === "authenticated") {
    const user = data.user;
    return (
      <form
        className="flex w-full items-center gap-5 bg-[#0d1726]"
        onSubmit={(e) => {
          e.preventDefault();
          if (content !== "") {
            setIscommenting(true);
            newtweet.mutate({
              content: content,
              tweetId,
            });
          }
        }}
      >
        <div className="flex h-full flex-col justify-start gap-[4.9rem]">
          <Avatar>
            <AvatarImage
              src={typeof user.image === "string" ? user.image : undefined}
              alt={typeof user.name === "string" ? user.name : undefined}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex w-full flex-col justify-start gap-1">
          <div>
            <TypographySmall>
              @{typeof user.name === "string" ? user.name : ""}
            </TypographySmall>
          </div>
          <div className="flex justify-center w-full gap-2">
            <Input
              maxLength={500}
              min={1}
              placeholder="comment on this post"
              className="w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
            <Button className="bg-slate-300 text-[#0d1726]" type="submit">
              {iscommenting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>Comment</>
              )}
            </Button>
          </div>
        </div>
      </form>
    );
  } else {
    return null;
  }
};
