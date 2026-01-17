import { db } from "@/db";
import { chats, messages } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch a specific chat with all its messages
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        const { id } = await params;

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const chatId = id;

        // Get the specific chat
        const chat = await db
            .select()
            .from(chats)
            .where(
                and(
                    eq(chats.id, chatId),
                    eq(chats.userId, session.user.id)
                )
            )
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json(
                { error: "Chat not found" },
                { status: 404 }
            );
        }

        // Get all messages for this chat
        const chatMessages = await db
            .select()
            .from(messages)
            .where(eq(messages.conversationId, chatId))
            .orderBy(messages.createdAt);

        return NextResponse.json(
            {
                ...chat[0],
                messages: chatMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching chat:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a specific chat and all its messages
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const chatId = params.id;

        // Verify the chat belongs to the user
        const chat = await db
            .select()
            .from(chats)
            .where(
                and(
                    eq(chats.id, chatId),
                    eq(chats.userId, session.user.id)
                )
            )
            .limit(1);

        if (chat.length === 0) {
            return NextResponse.json(
                { error: "Chat not found" },
                { status: 404 }
            );
        }

        await db
            .delete(messages)
            .where(eq(messages.conversationId, chatId));

        // Delete the chat
        await db.delete(chats).where(eq(chats.id, chatId));

        return NextResponse.json(
            { message: "Chat deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting chat:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}