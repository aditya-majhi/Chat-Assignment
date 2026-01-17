"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "@/components/ChatHistory";
import { WeatherCard } from "@/components/WeatherCard";
import { F1Card } from "@/components/F1RaceCard";
import { StockCard } from "@/components/StockPriceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Loader2, LogOut } from "lucide-react";
import { axiosAPI } from "@/lib/axios";

type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  kind: "text" | "tool";
  content: any;
  toolName?: string | null;
  createdAt?: string;
};

type Chat = { id: string; title: string };

export default function ChatDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const chatId = params?.id as string;

  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: chatsData } = await axiosAPI.get<Chat[]>("/chats");
        setChats(chatsData);

        if (chatId) {
          const { data: chatDetail } = await axiosAPI.get(`/chats/${chatId}`);
          setMessages(chatDetail.messages || []);
        }
      } catch (error) {
        console.error("Failed to load chat:", error);
        router.push("/chats");
      } finally {
        setLoading(false);
      }
    };
    if (status === "authenticated") load();
  }, [status, chatId, router]);

  const handleSelectChat = (id: string) => {
    router.push(`/chats/${id}`);
  };

  const handleNewChat = () => {
    router.push("/chats");
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    if (id === chatId) {
      router.push("/chats");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `local-${Date.now()}`,
      conversationId: chatId,
      role: "user",
      kind: "text",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    const body = { chatId, userMessage: input };
    setSending(true);
    setInput("");
    try {
      const { data, status: code } = await axiosAPI.post("/chats", body);
      if (code === 200 && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
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
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen grid grid-cols-12 overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={chatId}
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

        <ScrollArea className="flex-1 min-h-0 px-6 py-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((m) => {
              const isUser = m.role === "user";
              const isToolResult = m.kind === "tool";
              const bubble = (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                    isUser
                      ? "bg-primary text-primary-foreground ml-auto max-w-[70%]"
                      : "bg-muted text-foreground mr-auto max-w-[70%]"
                  }`}
                >
                  {m.kind === "text" ? m.content : null}
                </div>
              );
              return (
                <div key={m.id} className="flex">
                  {isUser ? (
                    <div className="flex-1 flex justify-end">{bubble}</div>
                  ) : (
                    <div className="flex-1 flex justify-start flex-col gap-2">
                      {m.kind === "text" ? bubble : null}
                      {isToolResult && m.toolName === "getWeather" && (
                        <WeatherCard data={m.content} />
                      )}
                      {isToolResult && m.toolName === "getF1Race" && (
                        <F1Card data={m.content.raceData} />
                      )}
                      {isToolResult && m.toolName === "getStockPrice" && (
                        <StockCard data={m.content.stockData} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-white">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Input
              placeholder="Send a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !sending && sendMessage()}
              disabled={sending}
            />
            <Button onClick={sendMessage} disabled={sending || !input.trim()}>
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
