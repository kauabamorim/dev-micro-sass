"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { NextResponse } from "next/server";
import { deleteCookie, getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function HomeForm() {
  const [user, setUser] = useState<User | null>(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getCookieValue("token");

      if (token) {
        try {
          const decoded = await verifyToken(token);
          if (decoded) {
            const response = await fetch(`/api/user/${decoded.id}`);
            const data = await response.json();
            setUser(data);
          }
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      } else {
        console.error("No token found in cookies");
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = () => {
    deleteCookie("token");
    window.location.href = "/";
  };

  if (!user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-background border-b px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link href="#" className="flex items-center" prefetch={false}>
          <MountainIcon className="h-6 w-6 text-black" />
          <span className="sr-only">Acme Social</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          >
            <SearchIcon className="h-6 w-6 text-black" />
          </Button>
          {isSearchExpanded && (
            <div className="absolute top-14 right-4 lg:right-6 w-full max-w-md bg-background border rounded-lg p-2">
              <Input type="search" placeholder="Search..." className="w-full" />
            </div>
          )}
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 text-black"
            prefetch={false}
          >
            <MessageCircleIcon className="h-5 w-5 mr-1 text-black" />
            <span className="sr-only">Messages</span>
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4 text-black"
            prefetch={false}
          >
            <BellIcon className="h-5 w-5 mr-1 text-black" />
            <span className="sr-only">Notifications</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 leading-none">
                  <div className="font-semibold">{`${user?.firstName} ${user?.lastName}`}</div>
                  <div className="text-sm text-muted-foreground">
                    {user?.username}
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <div className="h-4 w-4 text-black" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2"
                  prefetch={false}
                >
                  <div className="h-4 w-4 text-black" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-2"
                  prefetch={false}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSignOut();
                  }}
                >
                  <div className="h-4 w-4 text-black" />
                  <span>Sign out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main className="flex-1" />
    </div>
  );
}

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function MessageCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="bg-background border-b px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <span className="sr-only">Acme Social</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </nav>
      </header>
      <main className="flex-1 animate-pulse p-4">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        </div>
      </main>
    </div>
  );
}
