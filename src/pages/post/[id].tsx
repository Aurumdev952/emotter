/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArrowBigLeftIcon, Loader2 } from "lucide-react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { CommentComp } from "~/components/CommentComp";
import Layout from "~/components/Layout";
import { TweetLarge } from "~/components/tweetLarge";
import { TypographyH3, TypographyP } from "~/components/ui/typography";
import { ssgHelper } from "~/server/api/helper";
import { api } from "~/utils/api";


// TODO: add error handling for incorrect post id in url like post not found

const Post: NextPage<{ id: string }> = ({ id }) => {
    const postId: string = id !== undefined && typeof id === "string" ? id : ""; 
    const { data: tweet, isLoading, isError } = api.tweet.getTweet.useQuery(postId);
    const { data: comments } = api.tweet.getCommentOnTweets.useQuery(postId);
    return (
    <>
      <Head>
        <title>Emotter</title>
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
          <div className="h-full w-full overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-slate-400 scrollbar-thumb-rounded-md scrollbar-w-1 pt-10 pb-2">
            <div>
              {!!tweet && <div className="w-full flex flex-col justify-start gap-2">
                <TweetLarge {...tweet} />
                </div>}
              {isLoading && <div className="w-full h-full flex flex-col justify-start pt-20 items-center"><Loader2 className="mr-2 h-10 w-10 animate-spin" /></div>}
              {!tweet && isError && <div className="w-full h-full flex flex-col justify-start pt-16 items-center"><TypographyH3>Error has occured</TypographyH3></div>}
              <div className="w-full border-b-[.01rem] border-slate-700">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight py-4 pl-7">comments <span className="ml-1 h-6 w-6 text-md bg-slate-400 text-slate-800 rounded-full inline-block"><p className="w-full h-full flex justify-center items-center">{comments?.length.toString()}</p></span></h4>
              </div>
              {!!comments && <div className="w-full flex flex-col justify-start gap-2">
                {comments?.length > 0 ? <>{comments?.map((comment, key) => (<CommentComp key={key} {...comment} />))}</> : <div className="w-full h-full pt-4 flex justify-center"><p className="leading-7">no comments yet</p></div>}
                </div>}
            </div>
          </div>
      </Layout>
    </>
  );
};

export default Post;


export const getServerSideProps: GetServerSideProps = async (context) => {

  const id = context.params?.id
  if (typeof id !== "string") throw new Error("no id");
  const ssr = ssgHelper()
  await ssr.tweet.getTweet.prefetch(id)
  await ssr.tweet.getCommentOnTweets.prefetch(id)
  return {
    props: {
      trpcState: ssr.dehydrate(),
      id
    },
  };
}