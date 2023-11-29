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
import { useSession } from "next-auth/react";

interface LayoutProps {
  children?: React.ReactNode;
}
const Layout: NextPage<LayoutProps> = ({ children }) => {
  const { data, status } = useSession();
  return (
    <>
      <main suppressHydrationWarning className="container bg-[#0d1726]">
        <div className="menu hidden flex-col items-center justify-start gap-5 border-r-[.01rem] border-slate-700 py-10 lg:flex">
          <LinkButton link="/">
            <HomeIcon className="mr-2 h-4 w-5" /> home
          </LinkButton>
          <Button className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]">
            <BellIcon className="mr-2 h-4 w-5" /> notifications
          </Button>
          <Button className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]">
            <EnvelopeIcon className="mr-2 h-4 w-5" /> messages
          </Button>
          <LinkButton
            link={status === "authenticated" ? "/user/" + data.user.id : "/"}
            // className="flex w-[10rem] justify-start pl-6 hover:text-[#0d1726]"
          >
            <UserCircleIcon className="mr-2 h-4 w-5" /> profile
          </LinkButton>
          <DialogTweet />
        </div>
        <div className="feed relative flex flex-col justify-start gap-2 border-x-[.01rem] border-slate-700 px-2">
          {children}
        </div>
        <div className="sidebar hidden border-l-[.01rem] border-slate-700 lg:flex"></div>
      </main>
    </>
  );
};

export default Layout;

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
