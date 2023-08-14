import { TypographySmall } from "~/components/ui/typography";
import { Textarea } from "~/components/ui/textarea";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { api } from "~/utils/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ImageDialog } from "./NewTweetDialog";

export const NewTweet: React.FC = () => {
  const { data, status } = useSession();

  const utils = api.useContext();
  const [content, setContent] = useState<string>("");
  const [isposting, setIsposting] = useState<boolean>(false);
  const [image, setImage] = useState<
    | {
        image: string;
        file: File;
      }
    | undefined
  >();
  const newtweet = api.tweet.createTweet.useMutation({
    onSuccess: async () => {
      await utils.tweet.getAllTweets.refetch();
      setIsposting(false);
      setContent("");
      setImage(undefined);
      toast.success("post success");
    },
    onError: () => {
      setIsposting(false);
      toast.error("error posting");
    },
  });
  const readData = (f: File) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(f);
    });
  if (status === "authenticated") {
    const user = data.user;
    return (
      <form
        className="flex w-full items-center gap-5 bg-[#0d1726]"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={async (e) => {
          e.preventDefault();
          if (isposting) return false;
          if (content !== "" || image !== undefined) {
            setIsposting(true);
            const data: {
              content: string;
              image?: string;
            } = {
              content: content,
            };
            if (image) {
              data.image = (await readData(image?.file)) as string;
            }
            newtweet.mutate(data);
          }
        }}
      >
        <div className="flex h-full flex-col justify-center gap-[4.9rem]">
          <Avatar>
            <AvatarImage
              src={typeof user.image === "string" ? user.image : undefined}
              alt={typeof user.name === "string" ? user.name : undefined}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
          <Button
            onClick={() => void signOut()}
            className="group relative bg-slate-300 text-sm"
            size="sm"
          >
            <LogOut className="text-sm" color="#0d1726" />
            <span className="absolute -left-5 -top-2 hidden w-20 -translate-y-full rounded-lg bg-gray-700 px-2 py-1 text-center text-sm text-white after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700 after:content-[''] group-hover:flex">
              Log out
            </span>
          </Button>
        </div>
        <div className="flex w-full flex-col justify-start gap-1">
          <div className="flex items-center justify-between">
            <TypographySmall>
              @{typeof user.name === "string" ? user.name : ""}
            </TypographySmall>
            <ImageDialog image={image} setImage={setImage} />
          </div>
          <div className="grid w-full gap-2">
            <Textarea
              maxLength={1000}
              placeholder="Type your post here"
              className="w-full"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
              autoComplete="off"
            />
            {image && (
              <div className="w-full">
                {
                  <Image
                    src={image.image}
                    alt="image preview"
                    width={100}
                    height={80}
                  />
                }
              </div>
            )}
            <Button
              className="bg-slate-300 text-[#0d1726]"
              type="submit"
              disabled={isposting}
            >
              {isposting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>Create post</>
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
