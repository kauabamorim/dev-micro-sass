"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyToken } from "@/lib/auth";
import { getCookieValue } from "@/lib/utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function Settings() {
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

  const updateProfile = async (e: any) => {
    e.preventDefault();
    try {
      console.log("aaaaa");
    } catch (error: any) {
      console.log("ERROR UPDATE FRONT: ");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    defaultValue={user.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    defaultValue={user.username}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={user?.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Update your profile photo.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{""}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Change Photo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive updates and notifications via email.
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Enhance your account security.
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-muted-foreground">
                    This action cannot be undone.
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 flex justify-start">
        <Link href="/app/home" className="flex items-center" prefetch={false}>
          <Button variant="outline">Go Back</Button>
        </Link>
      </div>
    </div>
  );
}
