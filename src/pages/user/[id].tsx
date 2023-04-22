import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ArrowBigLeftIcon, Loader2 } from "lucide-react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "~/components/Layout";
import { UserProfileComp } from "~/components/UserProfileComp";
import { TweetLarge } from "~/components/tweetLarge";
import {
  TypographyH3,
  TypographyH4,
  TypographySmall,
} from "~/components/ui/typography";
import { ssgHelper } from "~/server/api/helper";
import { type RouterOutputs, api } from "~/utils/api";
import { Tweet } from "~/components/tweet";
import { type Color, type ColorElement } from "~/utils/colorTypes";

const UserProfile: NextPage<{ id: string, color: ColorElement["hex"] }> = ({ id, color }) => {
  const userId: string = id !== undefined && typeof id === "string" ? id : "";
  const { data: user, isLoading, isError } = api.user.getUser.useQuery(userId);
  return (
    <>
      <Head>
        <title>Emotter - {user?.name}</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
      </Head>
      <Layout>
        <div className="glass absolute left-0 top-0 z-10 flex h-10 w-full items-center justify-start gap-3 pl-4 pt-1">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full p-2 hover:bg-slate-100 hover:text-darkblue"
          >
            <ArrowBigLeftIcon />
          </Link>
          <p className="leading-7">Post</p>
        </div>
        <div className="h-full w-full overflow-y-scroll pt-10 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-400 scrollbar-thumb-rounded-md scrollbar-w-1">
        
          {!!user && (
            <div className="flex w-full flex-col items-center justify-start">
              <UserProfileComp {...user} color={color} />
              <UserTabs {...user} />
            </div>
          )}
          {isLoading && (
            <div className="flex h-full w-full flex-col items-center justify-start pt-20">
              <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex h-full w-full flex-col items-center justify-start pt-16">
              <TypographyH3>Error has occured</TypographyH3>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default UserProfile;

const UserTabs: React.FC<RouterOutputs["user"]["getUser"]> = ({
  likedTweets,
  tweets,
}) => {
  return (
    <Tabs defaultValue="tweets" className="m-0 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="tweets"
          className="transition-colors duration-100 data-[state='active']:bg-slate-100 data-[state='active']:bg-opacity-10 data-[state='active']:text-slate-100"
        >
          Posts
        </TabsTrigger>
        <TabsTrigger
          value="likes"
          className="transition-colors duration-100 data-[state='active']:bg-slate-100 data-[state='active']:bg-opacity-10 data-[state='active']:text-slate-100"
        >
          Likes
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tweets" className="m-0">
        {!!tweets && (
          <div className="flex w-full flex-col justify-start gap-2 pb-2">
            {tweets.length > 0 ? (
              <>
                {tweets?.map((tweet, key) => (
                  <Tweet {...tweet} key={key} />
                ))}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <TypographyH4>no posts yet</TypographyH4>
                <TypographySmall>no post here yet</TypographySmall>
              </div>
            )}
          </div>
        )}
      </TabsContent>
      <TabsContent value="likes" className="m-0">
        {!!likedTweets && (
          <div className="flex w-full flex-col justify-start gap-2 pb-2">
            {likedTweets.length > 0 ? (
              <>
                {likedTweets?.map((tweet, key) => (
                  <Tweet {...tweet.tweet}  key={key} />
                ))}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <TypographyH4>no posts yet</TypographyH4>
                <TypographySmall>no post here yet</TypographySmall>
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");
  const ssr = ssgHelper();
  const r = await fetch("https://www.colr.org/json/color/random")
  const color = await r.json() as Color;
  await ssr.user.getUser.prefetch(id);
  return {
    props: {
      trpcState: ssr.dehydrate(),
      id,
      color: color.colors[0]?.hex
    },
  };
};
