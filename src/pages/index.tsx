import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

import { api } from "~/utils/api";

const Home: NextPage = () => {
  
  

  return (
    <>
      <Head>
        <title>Emotter</title>
        <meta name="description" content="Share what you think!" />
        <link rel="icon" href="/emotter.svg" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="min-h-screen w-[30rem] border-x-[.1rem] border-white">
          <div></div>
          <AuthShowcase/> 
          <div></div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
        {secretMessage && <div>
          <Avatar>
            <AvatarImage src={typeof sessionData?.user.image === "string" ? sessionData?.user.image : undefined} />
            <AvatarFallback>{sessionData?.user.name}</AvatarFallback>
          </Avatar>

          </div>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};


function Input() {
  return (
  <div>
    
  </div>)
}
