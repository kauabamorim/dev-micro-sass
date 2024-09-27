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
import { getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function HomeForm() {
  const [user, setUser] = useState<User | null>(null);

  interface Post {
    id: number;
    username: string;
    handle: string | undefined;
    content: string;
    image: string | null;
    timestamp: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const handleSend = () => {
    if (inputValue.trim() === "" && !image) return;

    const newPost = {
      id: Date.now(),
      username: user?.firstName + " " + user?.lastName,
      handle: user?.username,
      content: inputValue,
      image: image,
      timestamp: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setInputValue("");
    setImage(null);
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const triggerImageUpload = () => {
    document.getElementById("imageUploadInput")?.click();
  };


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
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="bg-background rounded-xl shadow-sm border border-input p-4 mb-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src="https://api.dicebear.com/9.x/identicon/svg" alt="@shadcn" />
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="What's happening?"
                  className="resize-none border-0 focus:ring-0 p-0 text-lg font-medium"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={triggerImageUpload}>
                      <ImageIcon className="h-5 w-5" />
                      <span className="sr-only">Upload image</span>
                    </Button>
                    <input
                      id="imageUploadInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    <Button variant="ghost" size="icon">
                      <GiftIcon className="h-5 w-5" />
                      <span className="sr-only">Upload GIF</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <VoteIcon className="h-5 w-5" />
                      <span className="sr-only">Create poll</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <SmileIcon className="h-5 w-5" />
                      <span className="sr-only">Add emoji</span>
                    </Button>
                  </div>
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-0 shadow-sm">
                <CardHeader className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="/placeholder-user.jpg" alt={post.username} />
                    <AvatarFallback>{post.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{post.username}</div>
                    <div className="text-muted-foreground text-sm">{post.handle}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  {post.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      width={600}
                      height={400}
                      alt="Uploaded content"
                      className="mt-4 rounded-md"
                      style={{ aspectRatio: "600/400", objectFit: "cover" }}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                      <MessageCircleIcon className="h-5 w-5" />
                      <span className="sr-only">Comment</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RepeatIcon className="h-5 w-5" />
                      <span className="sr-only">Retweet</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <HeartIcon className="h-5 w-5" />
                      <span className="sr-only">Like</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ShareIcon className="h-5 w-5" />
                      <span className="sr-only">Share</span>
                    </Button>
                  </div>
                  <div className="text-muted-foreground text-sm">{post.timestamp}</div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function GiftIcon(props: any) {
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  )
}


function HeartIcon(props: any) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}


function ImageIcon(props: any) {
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
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
  )
}


function MessagesSquareIcon(props: any) {
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
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </svg>
  )
}


function RepeatIcon(props: any) {
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
      <path d="m17 2 4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="m7 22-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </svg>
  )
}


function ShareIcon(props: any) {
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
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}


function SignalIcon(props: any) {
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
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  )
}


function SmileIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}


function TwitterIcon(props: any) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}


function VoteIcon(props: any) {
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
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M22 19H2" />
    </svg>
  )
}