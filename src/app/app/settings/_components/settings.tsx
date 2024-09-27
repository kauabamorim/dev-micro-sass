"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { getCookieValue } from "@/lib/utils";
import { useEffect, useState } from "react";
import { verifyToken } from "@/lib/auth";
import { ThemeProvider, useTheme } from "next-themes";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Skeleton } from "@/components/ui/skeleton";

ThemeProvider;
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function Settings() {
  const { setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setId] = useState("");
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitProfile = async (e: any) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/update', {
        userId: userId,
        ...formData,
      });
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
        action: (
          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        ),
      })
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to update profile.",
        action: (
          <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        ),
      })
    }
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
            setId(decoded.id as string);
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

  const handleSaveChangesTheme = () => {
    window.location.reload();
  };

  if (!user) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-muted/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <h1 className="font-semibold text-3xl">Settings</h1>
        </div>
        <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
          <nav className="text-sm text-muted-foreground grid gap-4">
            <Link
              href="#general"
              className="font-semibold text-primary"
              prefetch={false}
            >
              General
            </Link>
            <Link href="#notifications" prefetch={false}>
              Notifications
            </Link>
            <Link href="#security" prefetch={false}>
              Security
            </Link>
            <Link href="#preferences" prefetch={false}>
              Preferences
            </Link>
          </nav>
          <div className="grid gap-6">
            <div id="general">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-6" onSubmit={handleSubmitProfile}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder={user.firstName}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder={user.lastName}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder={user.username}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={user.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                      />
                    </div>
                    <Button type="submit">Save Changes</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div id="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage your notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Email Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important updates.
                        </p>
                      </div>
                      <Switch id="email-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Desktop Notifications
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Receive desktop notifications for important updates.
                        </p>
                      </div>
                      <Switch id="desktop-notifications" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
            <div id="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account.
                        </p>
                      </div>
                      <Switch id="two-factor-auth" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Login Activity</p>
                        <p className="text-sm text-muted-foreground">
                          View your recent login activity.
                        </p>
                      </div>
                      <Button variant="outline">View Activity</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
            <div id="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your app preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Switch to a dark color scheme.
                        </p>
                      </div>
                      <Switch
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">
                          Select your preferred language.
                        </p>
                      </div>
                      <Select>
                        <SelectTrigger className="text-muted-foreground">
                          <SelectValue placeholder="English" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button onClick={handleSaveChangesTheme}>Save Changes</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground">
      <header className="bg-background border-b px-4 lg:px-6 h-14 flex items-center justify-between">
        <Skeleton className="w-24 h-6 bg-gray-300 rounded" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-6 h-6 bg-gray-300 rounded-full" />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-muted/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="max-w-6xl w-full mx-auto grid gap-2">
          <Skeleton className="h-8 w-1/4 bg-gray-300 rounded" />
        </div>
        <div className="grid md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] items-start gap-6 max-w-6xl w-full mx-auto">
          <nav className="text-sm text-muted-foreground grid gap-4">
            <Skeleton className="h-4 w-1/2 bg-gray-300 rounded" />
            <Skeleton className="h-4 w-2/3 bg-gray-300 rounded" />
            <Skeleton className="h-4 w-3/4 bg-gray-300 rounded" />
            <Skeleton className="h-4 w-1/2 bg-gray-300 rounded" />
          </nav>
          <div className="grid gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded shadow-sm">
                <div className="animate-pulse">
                  <Skeleton className="h-6 bg-gray-300 rounded mb-4" />
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <Skeleton className="h-4 bg-gray-300 rounded w-3/4" />
                        <Skeleton className="h-4 bg-gray-300 rounded w-1/4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
