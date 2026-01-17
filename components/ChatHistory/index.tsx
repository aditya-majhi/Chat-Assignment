"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { axiosAPI } from "@/lib/axios";

type Chat = { id: string; title: string };

type Props = {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onChatDeleted: (id: string) => void;
};

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onChatDeleted,
}: Props) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;
    setDeleting(true);
    try {
      await axiosAPI.delete(`/chats/${chatToDelete}`);
      onChatDeleted(chatToDelete);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    } finally {
      setDeleting(false);
      setChatToDelete(null);
    }
  };

  return (
    <>
      <aside className="col-span-3 border-r bg-white flex flex-col h-screen">
        <div className="p-4">
          <Button className="w-full gap-2" onClick={onNewChat}>
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  chat.id === activeChatId ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <p className="text-sm flex-1 truncate text-gray-900">
                  {chat.title}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleDeleteClick(chat.id, e as any);
                      }}
                      className="text-red-600 cursor-pointer gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            {chats.length === 0 && (
              <p className="text-sm text-muted-foreground px-2 py-4 text-center">
                No chats yet
              </p>
            )}
          </nav>
        </ScrollArea>
      </aside>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
