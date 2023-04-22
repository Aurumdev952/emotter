import { type NextPage } from "next";

import React from "react";
import { Button } from "~/components/ui/button";
import { DialogTweet } from "~/components/NewTweetDialog";
import { EnvelopeIcon, UserCircleIcon, HomeIcon, BellIcon } from '@heroicons/react/24/solid'

interface LayoutProps {
    children?: React.ReactNode
}
const Layout: NextPage<LayoutProps> = ({ children }) => {
    return <>
     <main className="container bg-[#0d1726]">
        <div className="menu border-r-[.01rem] border-slate-700 flex flex-col justify-start items-center py-10 gap-5">
          
            <Button className="hover:text-[#0d1726] w-[10rem] flex justify-start pl-6"><HomeIcon className="h-4 w-5 mr-2" /> home</Button>
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