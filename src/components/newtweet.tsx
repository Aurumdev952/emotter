import { TypographySmall } from "~/components/ui/typography";
import { Textarea } from "~/components/ui/textarea";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";
import { api } from "~/utils/api";
import { useState } from "react";


export const NewTweet:React.FC<Session> = ({user}) => {
    const utils = api.useContext();
    const [content, setContent] = useState<string>('')
// const postMessage = api.tweet.createTweet.useMutation({
//     onMutate: async (newEntry) => {
//         await utils.tweet.getAllTweets.cancel();
//         utils.tweet.getAllTweets.setData({number: 10, offset: 0}, (prevEntries) => {
//         if (prevEntries) {
//             return [newEntry, ...prevEntries];
//         } else {
//             return [newEntry];
//         }
//         });
//     },
//   onSettled: async () => {
//     await utils.tweet.getAllTweets.invalidate();
//   },
// });
    const newtweet = api.tweet.createTweet.useMutation({
        onSuccess: async () => {
            await utils.tweet.getAllTweets.refetch();
            setContent('')
        }
    })

    return (<form className="w-full flex items-center gap-5" onSubmit={(e) => {
        e.preventDefault();
         if (content !== '') {
            newtweet.mutate({
                content: content,
                authorId: user.id,
            })
        }
    }}>
    <div className="flex flex-col justify-center gap-[4.9rem] h-full">
    <Avatar>
        <AvatarImage src={typeof user.image === "string" ? user.image : undefined} alt={typeof user.name === "string" ? user.name : undefined} />
        <AvatarFallback>{user.name}</AvatarFallback>
      </Avatar>
    <Button
      onClick={() => void signOut()}
      className="bg-slate-300 text-sm"
      size="sm"
      >
        <LogOut className="text-sm" color="#0d1726"/>
      </Button>
    </div>
    <div className="flex flex-col justify-start gap-1 w-full">
      <div>
        <TypographySmall>
        @{typeof user.name === "string" ? user.name : ""}
        </TypographySmall>
      </div>
      <div className="grid w-full gap-2">
        <Textarea placeholder="Type your post here" className="w-full" value={content} onChange={(e) => setContent(e.target.value)} />
        <Button
        className="bg-slate-300 text-[#0d1726]"
        type="submit"
        >Create post</Button>
      </div>
    </div>
    </form>)
  }
  