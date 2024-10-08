"use client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { getCookieValue } from "@/lib/utils";
import { verifyToken } from "@/lib/auth";

let socket: Socket;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export function FormChat() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");
  const [currentConversationUser, setCurrentConversationUser] =
    useState<User | null>(null);

  useEffect(() => {
    fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      if (user && message.user !== user.username) {
        setCurrentConversationUser({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          username: message.user,
        });
      }
    });

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("WebSocket disconnected");
      }
    };
  }, [user]);

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
            setCurrentConversationUser(data);
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

  const handleSendMessage = () => {
    if (user) {
      const message = { user: user.username, text: newMessage };
      setMessages((prev) => [...prev, message]);
      socket.emit("message", message);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b border-muted">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="sr-only">Go Back</span>
            </Link>
          </Button>
          <Select
            value={currentConversationUser?.username || ""}
            onValueChange={(value) => {
              setCurrentConversationUser({
                id: "",
                firstName: "",
                lastName: "",
                email: "",
                username: value,
              });
            }}
          >
            <SelectTrigger className="bg-transparent border-none">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {currentConversationUser?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {currentConversationUser?.username || "Select User"}
                  </div>
                  <div className="text-xs text-muted-foreground">Online</div>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="John Doe">John Doe</SelectItem>
              <SelectItem value="Jane Smith">Jane Smith</SelectItem>
              <SelectItem value="Bob Johnson">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <SearchIcon className="w-5 h-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoveHorizontalIcon className="w-5 h-5" />
            <span className="sr-only">More</span>
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.user === user?.username ? "justify-end" : ""
              }`}
            >
              {msg.user !== user?.username && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`grid gap-1.5 ${
                  msg.user === user?.username
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                } p-3 rounded-lg max-w-[80%]`}
              >
                <div className="font-medium">{msg.user}</div>
                <div className="text-sm">{msg.text}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {msg.user === user?.username && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-muted p-4">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            className="pr-16 rounded-2xl resize-none"
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={handleSendMessage}
          >
            <SendIcon className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon(props: any) {
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
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function MoveHorizontalIcon(props: any) {
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
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
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

function SendIcon(props: any) {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
