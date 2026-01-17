"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import ChatsPage from "./chats/page";

export default function Page() {
  return <ChatsPage />;
}
