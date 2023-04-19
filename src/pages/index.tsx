/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession, } from "next-auth/react";

import { api } from "~/utils/api";
import React from "react";
import { Button } from "~/components/ui/button";
import { TypographyH3, TypographyH4, TypographyP, TypographySmall } from "~/components/ui/typography";
import { NewTweet } from "~/components/newtweet";
import { Loader2 } from "lucide-react"
import Layout from "~/components/Layout";
import { Tweet } from "~/components/tweet";


const Home: NextPage = () => {
  const { data: tweets, isLoading, isError } = api.tweet.getAllTweets.useQuery({
    number: 100,
    offset: 0,
  }) 
  return (
    <>
      <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
      </Head>
      <Layout>
          <div className="absolute w-full top-0 left-0 h-10 glass z-10 pl-4 pt-1">
            <TypographyP>
              Home
            </TypographyP>
          </div>
          <div className="w-full h-full overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-rounded-md scrollbar-thumb-slate-400 scrollbar-track-transparent pt-10">
          <div className="title border-b-[.01rem] border-slate-700 p-3">
            <AuthShowcase />
          </div>
          {!!tweets && <div className="w-full flex flex-col justify-start gap-2">{tweets.length > 0 ? <>{tweets?.map((tweet, key) => (<Tweet {...tweet} key={key}/>))}</> : <div className="w-full h-full flex flex-col gap-2 justify-center items-center"><TypographyH4>no posts yet</TypographyH4><TypographySmall>be the first to post😉</TypographySmall></div>}</div>}
          {isLoading && <div className="w-full h-full flex flex-col justify-start pt-16 items-center"><Loader2 className="mr-2 h-10 w-10 animate-spin" /></div>}
          {isError && <div className="w-full h-full flex flex-col justify-start pt-16 items-center"><TypographyH3>Error has occured</TypographyH3></div>}
          </div>
      </Layout>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { status } = useSession();
  if (status === "loading") {
    return <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-full h-[6rem] flex flex-col justify-center items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>
    </div>
  } 
  if (status === "authenticated") {
    return <div className="flex flex-col items-center justify-center gap-4">
      <NewTweet />
    </div>
  } 
  if (status === "unauthenticated") {
    return <div className="flex flex-col items-center justify-center gap-4">
      <TypographyH4>
      Sign in to start posting.
    </TypographyH4>
      <Button
      onClick={() => void signIn("discord")}
      >
        Sign in with Discord
      </Button>
      <Button
      onClick={() => void signIn("github")}
      >
        Sign in with Github
      </Button>
      <Button
      onClick={() => void signIn("google")}
      >
        Sign in with Google
      </Button>

    </div>
  } 
  return null
};




























