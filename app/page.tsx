"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="gap-2 bg-red-600 hover:bg-red-700"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
