/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import React from "react";
import { Button } from "~/components/ui/button";
import { TypographyH4 } from "~/components/ui/typography";
import { NewTweet } from "~/components/newtweet";
import { Tweet } from "~/components/tweet";




const Home: NextPage = () => {
  const { data: tweets } = api.tweet.getAllTweets.useQuery({
    number: 10,
    offset: 0,
  }) 
  return (
    <>
      <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
      </Head>
      <main className="container bg-[#0d1726]">
        <div className="menu border-r-[.01rem] border-slate-700"></div>
        <div className="feed border-x-[.01rem] border-slate-700 px-3 flex flex-col justify-start gap-2 items-stretch">
          <div className="title border-b-[.01rem] border-slate-700 p-3">
            <AuthShowcase />
          </div>
          {!!tweets && <>{tweets?.map((tweet, key) => (<Tweet {...tweet} key={key}/>))}</>}
          {!tweets && <p>loading</p>}
        </div>
        <div className="sidebar border-l-[.01rem] border-slate-700"></div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  
  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined },
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
    {!sessionData && <div className="flex flex-col justify-center items-center gap-3">
    <TypographyH4>
      Sign in to start posting.
    </TypographyH4>
    <Button
    onClick={() => void signIn("discord")}
    >
      Sign in
    </Button>
    </div>}
    
    {sessionData && <NewTweet user={sessionData.user} expires={sessionData.expires} />}
    </div>
  );
};




























