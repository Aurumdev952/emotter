import { type NextPage } from "next";

import React from "react";
import { Button } from "~/components/ui/button";
import { DialogTweet } from "~/components/NewTweetDialog";
import { EnvelopeIcon, UserCircleIcon, HomeIcon, BellIcon } from '@heroicons/react/24/solid'
import Link from "next/link";

interface LayoutProps {
    children?: React.ReactNode
}
const Layout: NextPage<LayoutProps> = ({ children }) => {
    return <>
     <main className="container bg-[#0d1726]">
        <div className="menu border-r-[.01rem] border-slate-700 flex flex-col justify-start items-center py-10 gap-5">
            <LinkButton link="/"><HomeIcon className="h-4 w-5 mr-2" /> home</LinkButton>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><BellIcon className="h-4 w-5 mr-2" /> notifications</Button>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><EnvelopeIcon className="h-4 w-5 mr-2" /> messages</Button>
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><UserCircleIcon className="h-4 w-5 mr-2" /> profile</Button>
          <DialogTweet />
        </div>
        <div className="feed border-x-[.01rem] border-slate-700 px-2 flex flex-col justify-start gap-2 relative">
            {children}
        </div>
        <div className="sidebar border-l-[.01rem] border-slate-700"></div>
      </main>
    </>
}

export default Layout


const LinkButton:React.FC<{ link: string, children?: React.ReactNode }> = ({ link, children }) => {
  return (<Link href={link} className="hover:text-[#0d1726] w-[10rem] justify-start pl-6 inline-flex items-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 h-10 py-2 px-4">{children}</Link>)
}