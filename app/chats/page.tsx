"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Send, Loader2 } from "lucide-react";
import { axiosAPI } from "@/lib/axios";

type Chat = { id: string; title: string };

export default function ChatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: chatsData } = await axiosAPI.get<Chat[]>("/chats");
        setChats(chatsData);
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") load();
  }, [status]);

  const handleSelectChat = (id: string) => {
    router.push(`/chats/${id}`);
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handleNewChat = () => {
    router.push("/chats");
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const { data, status: code } = await axiosAPI.post("/chats", {
        chatId: null,
        userMessage: input,
      });

      if (code === 200 && data.chatId) {
        // Add new chat to the list
        setChats((prev) => [
          { id: data.chatId, title: input.slice(0, 30) || "New chat" },
          ...prev,
        ]);
        // Navigate to the new chat
        router.push(`/chats/${data.chatId}`);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setSending(false);
      setInput("");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen grid grid-cols-4">
        <div className="border-r p-4 space-y-2">
          <Skeleton className="h-10 w-full" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="col-span-3 p-6 space-y-4">
          <Skeleton className="h-10 w-56" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen grid grid-cols-12 bg-linear-to-b from-slate-50 to-white">
      <Sidebar
        chats={chats}
        activeChatId={null}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onChatDeleted={handleDeleteChat}
      />

      <main className="col-span-9 flex flex-col h-screen">
        <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Chat</h2>
          </div>
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center text-muted-foreground space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome to Chat
              </h2>
              <p className="text-sm">
                Start a new conversation or select a chat from the sidebar
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message to start a new chat..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !sending && sendMessage()
                  }
                  disabled={sending}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="gap-2"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Press Enter to send or click the Send button
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
