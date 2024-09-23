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
import { deleteCookie, getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function HomeForm() {
  const [user, setUser] = useState<User | null>(null);

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

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-background border-b px-4 lg:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 rounded-full" />
            <span className="sr-only">Acme Social</span>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </nav>
        </header>
        <main className="flex-1 animate-pulse p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 rounded w-1/4" />
            <Skeleton className="h-6 rounded w-1/3" />
            <Skeleton className="h-6 rounded w-1/2" />
            <Skeleton className="h-6 rounded w-3/4" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <h1>Welcome, {user.firstName}!</h1>
      </main>
    </div>
  );
}