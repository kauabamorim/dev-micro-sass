"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";
import { Header } from "@/components/header";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  name: string;
}

export function Profile() {
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
    <main>
      <Header />
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
        <div className="flex flex-col gap-8 md:w-2/3">
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">Software Engineer</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              John is a passionate software engineer with a strong background in
              full-stack development. He loves building innovative web
              applications and is always eager to learn new technologies.
            </p>
          </div>
          <div className="bg-muted rounded-lg p-6">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="#"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <TwitterIcon className="h-6 w-6 text-[#1DA1F2]" />
                <span>@johndoe</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <InstagramIcon className="h-6 w-6 text-[#E1306C]" />
                <span>@johndoe</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <LinkedinIcon className="h-6 w-6 text-[#0077B5]" />
                <span>johndoe</span>
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2"
                prefetch={false}
              >
                <GithubIcon className="h-6 w-6 text-[#333]" />
                <span>johndoe</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <img
                  src="/placeholder.svg"
                  width={400}
                  height={225}
                  alt="Project Image"
                  className="rounded-t-lg object-cover aspect-video"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle>Project A</CardTitle>
                <CardDescription>
                  A web application that helps users manage their tasks and
                  projects.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-6 md:w-1/3">
          <div className="grid gap-6">
            <div>
              <h3 className="text-lg font-semibold">Skills</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>JavaScript</Badge>
                <Badge>React</Badge>
                <Badge>Node.js</Badge>
                <Badge>SQL</Badge>
                <Badge>Git</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Interests</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>Web Development</Badge>
                <Badge>Open Source</Badge>
                <Badge>Artificial Intelligence</Badge>
                <Badge>Entrepreneurship</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="mt-2 grid gap-2">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span>+55 (47) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="#"
                    className="underline underline-offset-2"
                    prefetch={false}
                  >
                    youtube.com
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
      <div className="flex flex-col gap-8 md:w-2/3">
        <div className="bg-muted rounded-lg p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            <div className="grid gap-1 flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted rounded-lg animate-pulse">
            <div className="h-56 bg-gray-200 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted rounded-lg p-6 md:w-1/3 animate-pulse">
        <div className="grid gap-6">
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="mt-2 grid gap-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GithubIcon(props: any) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function GlobeIcon(props: any) {
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
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function InstagramIcon(props: any) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(props: any) {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon(props: any) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon(props: any) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
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
  );
}
