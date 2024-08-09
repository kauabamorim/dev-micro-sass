"use client";
import Link from "next/link";
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
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

export default function Home() {
  const form = useForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await axios.post("api/auth/register", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      });

      if (response.status === 201) {
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
        const token = response.data.token;
        document.cookie = `token=${token}; path=/`;
        window.location.href = "/";
      } else {
        throw new Error("Failed to create account");
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
    <main>
      <div className="flex min-h-[100dvh] flex-col">
        <main className="flex-1 bg-muted py-12 md:py-24 lg:py-32">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:gap-16 lg:px-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Connect with friends and family
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Nexi is the best way to stay connected with the people who
                matter most. Share updates, photos, and more with your loved
                ones.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  prefetch={false}
                >
                  Sign In
                </Link>
                <Link
                  href="#"
                  className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                  prefetch={false}
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="rounded-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription>
                    Create a new account to connect with friends and family.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          {...form.register("firstName")}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          {...form.register("lastName")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        required
                        {...form.register("email")}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form.register("password")}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </main>
        <footer className="bg-background px-4 py-6 shadow-sm md:px-6 lg:px-8">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
            <nav className="flex items-center gap-4">
              <Link
                href="#"
                className="text-sm hover:underline"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm hover:underline"
                prefetch={false}
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-sm hover:underline"
                prefetch={false}
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-sm hover:underline"
                prefetch={false}
              >
                Contact
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Nexi. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
