/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import React from "react";
import { Button } from "~/components/ui/button";
import {
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographySmall,
} from "~/components/ui/typography";
import { NewTweet } from "~/components/newtweet";
import { Loader2 } from "lucide-react";
import Layout from "~/components/Layout";
import { Tweet } from "~/components/tweet";
import { ssgHelper } from "~/server/api/helper";

const Home: NextPage = () => {
  const {
    data: tweets,
    isLoading,
    isError,
  } = api.tweet.getAllTweets.useQuery({
    number: 100,
    offset: 0,
  });
  return (
    <>
      <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
        <script defer data-domain="emotter-two.vercel.app" src="https://plausible.io/js/script.js"></script>
      </Head>
      <Layout>
        <div className="glass absolute left-0 top-0 z-10 h-10 w-full pl-4 pt-1">
          <TypographyP>Home</TypographyP>
        </div>
        <div className="h-full w-full overflow-y-scroll pt-10 scrollbar scrollbar-track-transparent scrollbar-thumb-slate-400 scrollbar-thumb-rounded-md scrollbar-w-1">
          <div className="title border-b-[.01rem] border-slate-700 p-3">
            <AuthShowcase />
          </div>
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
                  <TypographySmall>be the first to post😉</TypographySmall>
                </div>
              )}
            </div>
          )}
          {isLoading && (
            <div className="flex h-full w-full flex-col items-center justify-start pt-16">
              <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div>
          )}
          {!tweets && isError && (
            <div className="flex h-full w-full flex-col items-center justify-start pt-16">
              <TypographyH3>Error has occured</TypographyH3>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex h-[6rem] w-full flex-col items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      </div>
    );
  }
  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <NewTweet />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <TypographyH4>Sign in to start posting.</TypographyH4>
        <Button onClick={() => void signIn("discord")}>
          Sign in with Discord
        </Button>
        <Button onClick={() => void signIn("github")}>
          Sign in with Github
        </Button>
        <Button onClick={() => void signIn("google")}>
          Sign in with Google
        </Button>
      </div>
    );
  }
  return null;
};

export const getServerSideProps: GetServerSideProps = async () => {
  const ssr = ssgHelper();
  await ssr.tweet.getAllTweets.prefetch({
    number: 100,
    offset: 0,
  });
  return {
    props: {
      trpcState: ssr.dehydrate(),
    },
  };
};
