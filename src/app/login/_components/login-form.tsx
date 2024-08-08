"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

export function LoginForm() {
  const form = useForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await axios.post("api/auth/login", {
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        document.cookie = `token=${token}; path=/`;
        window.location.href = "/";
      } else {
        throw new Error("Failed to login account");
      }
    } catch (error) {
      console.log("error:", error);

      let errorMessage = "An error occurred. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error;
      }

      toast({
        title: "Error",
        description: errorMessage,
      });
    }
  });

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div>
            <MountainIcon className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Login
            </h1>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                required
                {...form.register("email")}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                {...form.register("password")}
              />
            </div>
            <Button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Login
            </Button>
          </form>
          <Link
            href="/register"
            className="text-sm font-medium text-primary hover:underline"
            prefetch={false}
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
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
