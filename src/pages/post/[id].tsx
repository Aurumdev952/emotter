import { ArrowBigLeftIcon, Loader2 } from "lucide-react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "~/components/Layout";
import { TweetLarge } from "~/components/tweetLarge";
import { TypographyH3 } from "~/components/ui/typography";
import { api } from "~/utils/api";

const Post: NextPage = () => {
    const router = useRouter()
    const { id } = router.query
    const postId: string = id !== undefined && typeof id === "string" ? id : ""; 
    const { data: tweet, isLoading, isError } = api.tweet.getTweet.useQuery(postId);
    return (
    <>
      <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
      </Head>
      <Layout>
        <div className="w-full pt-10">
          <div className="glass absolute left-0 top-0 z-10 flex h-10 w-full items-center justify-start gap-3 pl-4 pt-1">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-full p-2 hover:bg-slate-100 hover:text-darkblue"
            >
              <ArrowBigLeftIcon />
            </Link>
            <p className="leading-7">Post</p>
          </div>
          {!!tweet && <div className="w-full flex flex-col justify-start gap-2">
            <TweetLarge {...tweet} /></div>}
          {isLoading && <div className="w-full h-full flex flex-col justify-start pt-20 items-center"><Loader2 className="mr-2 h-10 w-10 animate-spin" /></div>}
          {isError && <div className="w-full h-full flex flex-col justify-start pt-16 items-center"><TypographyH3>Error has occured</TypographyH3></div>}
        </div>
      </Layout>
    </>
  );
};

export default Post;
