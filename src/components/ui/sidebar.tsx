"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import {Sun, Moon, BookOpen, ChevronDown} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Book } from "@/types/book";
import { useTheme } from 'next-themes'
import { useEffect } from "react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  locked,
  setLocked,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <DesktopSidebar locked={locked} setLocked={setLocked} {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  locked,
  setLocked,
  ...props
}: React.ComponentProps<typeof motion.div> &  {
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "60px") : "300px",
        }}
        onMouseEnter={() => !locked && setOpen(true)}
        onMouseLeave={() => !locked && setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2  group/sidebar py-2",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
export const SideButton = ({
  button,
  label,
  className,
}: {
  button: React.ReactNode;
  label?: string | null
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2  group/sidebar py-2",
        className
      )}
    >
      {button}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </div>
  );
};
interface SideDarkModeProps {
  className?: string;
}

export const SideDarkMode = ({
  className,
}: SideDarkModeProps) => {
  const { open, animate } = useSidebar(); // Assuming useSidebar is a hook for managing sidebar state
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkMode = theme === 'dark';
  const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        className
      )}
    >
      <div onClick={toggleTheme} className="hover:cursor-pointer">
        {isDarkMode ? (
          <Sun className="text-primary h-5 w-5 flex-shrink-0" />
        ) : (
          <Moon className="text-primary h-5 w-5 flex-shrink-0" />
        )}
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        <div onClick={toggleTheme} className="hover:cursor-pointer">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </div>
      </motion.span>
    </div>
  );
};
export const SideBook = ({
  books,
  className,
}:{
  books: Book[],
  className?: string,
}) => {
  const { open, animate } = useSidebar(); // Assuming useSidebar is a hook for managing sidebar state
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div
      className={cn(
        "group/sidebar py-2",
        className
      )}
    >
      <div className="flex items-center justify-start gap-2 ">
        <div className="hover:cursor-pointer">
          <BookOpen className="text-primary h-5 w-5 flex-shrink-0" />
        </div>
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
        >
          <div className="relative flex gap-5 items-center justify-between w-full">
            <div
              className="cursor-pointer"
              onClick={handleDropdownToggle}
            >
              Books 
            </div>
            <ChevronDown className="cursor-pointer" onClick={handleDropdownToggle}/>
          </div>
        </motion.span>
      </div>
      {isDropdownOpen && open &&(
        <div className="w-48">
          {books.length > 0 ? (
            <ul className="py-0 my-2">
              {books.map((book) => (
                <Link key={book.id} href={`/dashboard/${book.id}`}>
                  <li className="text-xs py-2 px-5 hover:bg-slate-200 dark:hover:bg-gray-700">
                    {book.title}
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-center text-gray-500 dark:text-gray-400">
              No books available
            </div>
          )}
        </div>
      )}
    </div>
  );
};