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
    return <LoadingSkeleton />;
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
