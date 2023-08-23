import { type NextPage } from "next";

import React from "react";
import { Button } from "~/components/ui/button";
import { DialogTweet } from "~/components/NewTweetDialog";
import {
  EnvelopeIcon,
  UserCircleIcon,
  HomeIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

interface LayoutProps {
  children?: React.ReactNode;
}
const LayoutMessage: NextPage<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full flex-col justify-start bg-darkdarkblue">
      <nav className="fixed left-0 top-0 h-10 w-full">
        <h1>emmoter</h1>
      </nav>
      <div className="container">
        <div className="main p-4 mt-12">
          <div className="bg-darkblue rounded-lg">{children}</div>
        </div>
        <div className="sidebar">
          <LinkButton link="/">
            <HomeIcon className="mr-2 h-4 w-5" /> home
          </LinkButton>
          <Button className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]">
            <BellIcon className="mr-2 h-4 w-5" /> notifications
          </Button>
          <Button className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]">
            <EnvelopeIcon className="mr-2 h-4 w-5" /> messages
          </Button>
          <Button className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]">
            <UserCircleIcon className="mr-2 h-4 w-5" /> profile
          </Button>
          <DialogTweet />
        </div>
      </div>
      {/* <main className="container bg-[#0d1726]">
        <div className="menu hidden lg:flex border-r-[.01rem] border-slate-700 flex-col justify-start items-center py-10 gap-5">
            <LinkButton link="/"><HomeIcon className="h-4 w-5 mr-2" /> home</LinkButton>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><BellIcon className="h-4 w-5 mr-2" /> notifications</Button>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><EnvelopeIcon className="h-4 w-5 mr-2" /> messages</Button>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><UserCircleIcon className="h-4 w-5 mr-2" /> profile</Button>
          <DialogTweet />
        </div>
        <div className="feed border-x-[.01rem] border-slate-700 px-2 flex flex-col justify-start gap-2 relative">
            {children}
        </div>
        <div className="sidebar hidden lg:flex border-l-[.01rem] border-slate-700"></div>
      </main> */}
    </div>
  );
};

export default LayoutMessage;

const LinkButton: React.FC<{ link: string; children?: React.ReactNode }> = ({
  link,
  children,
}) => {
  return (
    <Link
      href={link}
      className="inline-flex h-10 w-[10rem] items-center justify-start rounded-md bg-slate-900 px-4 py-2 pl-6 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 hover:bg-slate-700 hover:text-[#0d1726] dark:bg-slate-50 dark:text-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      {children}
    </Link>
  );
};
