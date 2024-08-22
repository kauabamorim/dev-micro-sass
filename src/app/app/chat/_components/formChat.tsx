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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

let socket: Socket;

export function FormChat() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("Connect WebSocket server");
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("WebSocket disconnected");
      }
    };
  }, []);

  const handleSendMessage = () => {
    const message = { user: "You", text: newMessage };
    setMessages((prev) => [...prev, message]);
    socket.emit("message", message);
    setNewMessage("");
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
          <Select defaultValue="John Doe">
            <SelectTrigger className="bg-transparent border-none">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
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
                msg.user === "You" ? "justify-end" : ""
              }`}
            >
              {msg.user !== "You" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`grid gap-1.5 ${
                  msg.user === "You"
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
              {msg.user === "You" && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>YO</AvatarFallback>
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
