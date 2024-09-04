"use client";
import React, { ReactNode, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, SideBook, SideButton, SideDarkMode } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightFromLine, ArrowLeftFromLine, Sun, Moon } from "lucide-react";
import { useUser, SignedIn, UserButton  } from "@clerk/nextjs";
import SvgLogo from "@/components/svgLogo";
import { useTheme } from "next-themes";
import { Book } from "@/types/book";

interface SideBarProps {
  children: ReactNode
}
const dummyBookData = [
  {
    id: "randomString1",
    title: "Topology",
    description: "Math is very fun and it's so cool, oh my god.",
    purpose: "Education",
    pages: [],
  },
  {
    id: "randomString2",
    title: "Math",
    description: "Math is very fun and it's so cool, oh my god.",
    purpose: "Education",
    pages: [],
  },
  {
    id: "randomString3",
    title: "Calculus",
    description: "Math is very fun and it's so cool, oh my god.",
    purpose: "Education",
    pages: [],
  },
];
export function GnovistarSidebar({children}:SideBarProps) {
  const { isSignedIn, isLoaded, user } = useUser()
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-primary h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Profile",
    //   href: "#",
    //   icon: (
    //     <IconUserBolt className="text-primary h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-primary h-5 w-5 flex-shrink-0" />
      ),
    },
    // {
    //   label: "Dark Mode",
    //   href: "#",
    //   icon: (
    //     <IconArrowLeft className="text-primary h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false)
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody locked={locked} setLocked={setLocked} className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? (
              <div className="flex justify-between">
                <Logo />
                <div className="hidden md:block">
                  <Button
                    className="border-0 hover:bg-slate-200 dark:hover:bg-gray-700 bg-transparent"
                    title={locked ? "Unlock Sidebar" : "Lock Sidebar"}
                    variant="outline"
                    onClick={() => setLocked(!locked)}
                  >
                    {locked ? <ArrowLeftFromLine /> : <ArrowRightFromLine />}
                  </Button>
                </div>  
              </div>
            )
              : <LogoIcon />}
            {open && 
              <Link href="/dashboard/new-book">
                <Button className="w-full my-4">
                  <Plus className="mr-2 h-4 w-4" /> New Book
                </Button>
              </Link>
            }
            <div className="flex flex-col gap-2 mt-5">
              <SideBook books={dummyBookData}/>
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink className="text-primary" key={idx} link={link} />
              ))}
              <SideDarkMode />
            </div>
          </div>
          <div>
            <SideButton button={
              <SignedIn>
                <UserButton/>
              </SignedIn>
            } label={user?.fullName}/>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <SvgLogo color="66CCCC" width="32" height="32" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre w-min"
      >
        Gnovistar
      </motion.div>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <SvgLogo color="66CCCC" width="32" height="32" />
    </Link>
  )
};

